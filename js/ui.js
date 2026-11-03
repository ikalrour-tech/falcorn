/* ============================================================
   UI — HUD, panel, modal, kartu bangunan, grafik
   ============================================================ */
window.GAME = window.GAME || {};
const U = GAME.ui = { buildSel:null, sel:null, panel:null, S:null };

/* ---------- util DOM ---------- */
const $ = id => document.getElementById(id);
GAME.el = $;
GAME.toast = function(msg, cls, ms){
  const t=document.createElement('div'); t.className='toast '+(cls||''); t.textContent=msg;
  $('toasts').appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(()=>t.remove(),400); }, ms||2600);
};
GAME.showModal = function(title, html){
  $('modalTitle').textContent=title; $('modalBody').innerHTML=html;
  $('modalOverlay').classList.remove('hidden');
};
GAME.closeModal = function(){
  $('modalOverlay').classList.add('hidden'); if(U.panel) U.panel=null; syncToolbar();
  const f=GAME._afterReport; GAME._afterReport=null;
  if(f) setTimeout(f, 80);
};
$('modalClose').onclick = ()=>{ GAME.closeModal(); GAME.SFX.click(); };
$('modalOverlay').addEventListener('click', e=>{ if(e.target.id==='modalOverlay') GAME.closeModal(); });

/* ---------- HUD ---------- */
GAME.updateHUD = function(S){
  $('hudDate').textContent = `Bulan ${S.month}, Tahun ${S.year}`
    + (S.mode==='challenge'?` · ⏳${GAME.chalLeft(S)} periode`:'')
    + ` · 🕐 ${GAME.City.timeTxt(S)}` + (GAME.City.paused?' · ⏸ DIJEDA':'');
  $('hudTreasury').textContent = GAME.fmtRp(S.treasury);
  $('hudIncome').textContent = GAME.fmtRp(S.last.income);
  $('hudExpense').textContent = GAME.fmtRp(S.last.expense);
  $('hudInflasi').textContent = S.stats.inflasi.toFixed(1)+'%';
  $('hudUnemp').textContent = S.stats.unemp.toFixed(1)+'%';
  $('hudWelfare').textContent = S.stats.welfare+'%';
  const cls=(el,bad,good)=>{ el.parentElement.classList.toggle('bad',bad); el.parentElement.classList.toggle('good',good); };
  cls($('hudInflasi'), S.stats.inflasi>=6, S.stats.inflasi<3);
  cls($('hudUnemp'), S.stats.unemp>=15, S.stats.unemp<8);
  cls($('hudWelfare'), S.stats.welfare<40, S.stats.welfare>=65);
  // banner misi
  const mb=$('missionBanner');
  if(S.mode==='story'){
    mb.classList.remove('hidden');
    const ch=GAME.CHAPTERS.find(c=>c.id===S.chapter);
    if(S.flags.storyDone){
      $('mbChapter').textContent='👑 Presiden Ekonomi — Semua Bab Selesai';
      $('mbObjectives').innerHTML='<div class="done">✔ Tujuh bab tuntas. Kota bebas kamu kembangkan!</div>';
    } else {
      const objs=GAME.Story.objectives(S), done=objs.filter(o=>o.ok).length;
      $('mbChapter').textContent=`${ch.title} · ${done}/${objs.length}`;
      $('mbObjectives').innerHTML=objs.map(o=>`<div class="${o.ok?'done':''}">${o.ok?'✔':'○'} ${o.t}</div>`).join('');
    }
  } else if(S.mode==='challenge'){
    const c=GAME.CHALLENGES.find(x=>x.id===S.challenge);
    mb.classList.remove('hidden');
    const status = S.challengeDone ? (S.challengeWon?' · ✅ Selesai':' · ⏰ Gagal') : ` · ⏳${GAME.chalLeft(S)}p`;
    $('mbChapter').textContent=c.name+status;
    const best=GAME.bestFor(c.id);
    $('mbObjectives').innerHTML=`<div>${c.d}</div>`
      + (best?`<div class="done">${GAME.rankBadge(best.rank)} Terbaik: ${GAME.RANKS[best.rank].name} · ${best.periods} periode</div>`:'');
  } else mb.classList.add('hidden');
  // tempelkan banner tepat di bawah HUD — HUD bisa membungkus 2–3 baris di layar sempit
  const tt=$('toasts');
  if(!mb.classList.contains('hidden')){
    const mbBottom=Math.round(mb.getBoundingClientRect().bottom);
    mb.style.top=Math.round($('hud').getBoundingClientRect().bottom+6)+'px';
    tt.style.top=(mbBottom+8)+'px';
  } else { mb.style.top=''; tt.style.top=''; }
};

/* ---------- aksi periode ---------- */
GAME.endTurn = function(S){
  if(GAME.Story.active) return;
  GAME.SFX.turn();
  const rep = GAME.advancePeriod(S);
  GAME.Story.tickSide(S);
  let afterReport = null;
  // cek misi cerita
  if(S.mode==='story' && S.chapterPhase==='playing' && GAME.Story.allDone(S)){ GAME.Story.completeChapter(S); }
  // cek challenge — hasil baru ditampilkan setelah laporan periode ditutup
  if(S.mode==='challenge' && !S.challengeDone){
    const ch=GAME.CHALLENGES.find(x=>x.id===S.challenge);
    if(ch && ch.goal(S)){
      const used=Math.max(1, ch.limit - GAME.chalLeft(S));
      const prevBest=GAME.bestFor(ch.id);
      const rank=GAME.rankFor(ch, used);
      const isBest=GAME.recordRating(ch.id, rank, used);
      S.challengeDone=true; S.challengeWon=true; S.challengePeriods=used;
      GAME.SFX.win(); GAME.save(S); GAME.updateHUD(S);
      afterReport=()=>GAME.showChallengeEnd(S, ch, true, used, rank, isBest, prevBest);
    } else if(ch && GAME.chalLeft(S)<=0){
      S.challengeDone=true; S.challengeWon=false; S.challengePeriods=ch.limit;
      GAME.save(S); GAME.updateHUD(S);
      afterReport=()=>GAME.showChallengeEnd(S, ch, false, ch.limit, null, false, null);
    }
  }
  (rep.achievements||[]).forEach(a=>{ GAME.toast(`${a.ico} Pencapaian: ${a.name} (+${GAME.fmtRp(a.reward)})`,'gold',4000); });
  rep.events.filter(e=>e.type==='bad').forEach(()=>GAME.SFX.warn());
  GAME.City.onPeriod(S);
  // kejadian krisis pangan: pemicu jelas dari simulasi → dashboard → dialog Menteri
  const key=S.year*12+S.month;
  const crisis = S.goods.beras.stock<50 && !(S.mode==='story'&&S.chapter<2) && S.flags.crisisDlg!==key;
  if(crisis){
    S.flags.crisisDlg=key;
    GAME.updateHUD(S);
    GAME.toast('⚠️ Dashboard: stok beras kritis!','warn',3500);
    GAME.Story.play([
      ['menteri',`Pak Presiden, stok beras kita tinggal ${Math.round(S.goods.beras.stock)} unit sementara warga membutuhkan sekitar ${Math.round(S.goods.beras.demand||0)} unit per periode. Harga naik sampai Rp${Math.round(S.goods.beras.price).toLocaleString('id')}/kg.`],
      ['menteri','Cek panel Ekonomi dan ikon keluhan 🛒 di peta. Tingkatkan produksi pertanian, bangun gudang & jalan, atau aktifkan subsidi pangan. Harga tidak bisa dijamin turun—semua bergantung stok vs permintaan.']],
      ()=>GAME.showReport(rep, afterReport));
    GAME.save(S); return;
  }
  GAME.showReport(rep, afterReport);
  GAME.updateHUD(S);
  GAME.save(S);
};
GAME.chalLeft = function(S){
  const ch=GAME.CHALLENGES.find(x=>x.id===S.challenge); if(!ch) return 99;
  return ch.limit - ((S.year-1)*12 + S.month - 1);
};
GAME.showReport = function(rep, after){
  GAME._afterReport = after || null;
  let h = `<div class="rep-sec">Anggaran Periode Ini</div>
  <div class="rep-row"><span>📈 Pendapatan</span><span class="v pos">${GAME.fmtRp(rep.income)}</span></div>
  <div class="rep-row"><span>📉 Pengeluaran</span><span class="v neg">${GAME.fmtRp(-rep.expense)}</span></div>
  <div class="rep-row"><b>Saldo</b><span class="v ${rep.net>=0?'pos':'neg'}"><b>${rep.net>=0?'Surplus +':'Defisit '}${GAME.fmtRp(rep.net)}</b></span></div>
  <div class="rep-sec">Pasar & Produksi</div>
  <div class="ec-scroll"><table class="ec"><tr><th>Barang</th><th>Terjual</th><th>Permintaan</th><th>Stok</th><th>Harga</th></tr>`;
  for(const [g,r] of Object.entries(rep.goods)){
    const d=GAME.GOODS[g]; const warn = r.stock < r.demand*0.4 ? '⚠️ ' : '';
    h+=`<tr><td>${d.icon} ${warn}${d.name}</td><td>${Math.round(r.sold)}</td><td>${Math.round(r.demand)}</td><td>${Math.round(r.stock)}</td><td>Rp${Math.round(r.price).toLocaleString('id')}</td></tr>`;
  }
  h+=`</table></div>`;
  if(rep.notes.length) h+=`<div class="rep-sec">Catatan Menteri</div>` + rep.notes.map(n=>`<p style="font-size:13px;margin:6px 0">• ${n}</p>`).join('');
  h+=`<button class="big-btn green" onclick="GAME.closeModal()">Lanjut Memerintah ▸</button>`;
  GAME.showModal('📋 Laporan Akhir Periode', h);
};
GAME.showChallengeEnd = function(S, ch, won, periods, rank, isBest, prevBest){
  if(!won){
    GAME.showModal('⏳ Waktu Habis', `<div style="text-align:center;font-size:14px">
      <div style="font-size:52px">${ch.ico}⏳</div><h3>${ch.name}</h3>
      <p>Target belum tercapai dalam <b>${ch.limit} periode</b>.<br>Jangan menyerah — coba strategi lain!</p>
      <p style="font-size:12.5px;color:#5a6675;background:#fff7e0;border-left:4px solid var(--gold);padding:8px 10px;border-radius:8px;text-align:left">💡 ${ch.tips||'Periksa panel Ekonomi untuk melihat penyebabnya, lalu sesuaikan kebijakan.'}</p>
      <button class="big-btn green" onclick="GAME.closeModal();GAME.startGame(GAME.newState('challenge','${ch.id}'))">🔄 Coba Lagi</button>
      <button class="big-btn" onclick="GAME.closeModal();GAME.toMenu()">🏠 Kembali ke Menu</button></div>`);
    return;
  }
  const R=GAME.RANKS[rank]||GAME.RANKS.perunggu;
  const bestTxt = isBest ? '🎉 Rekor terbaik baru tersimpan!'
    : (prevBest ? `Rekor terbaikmu: ${GAME.rankBadge(prevBest.rank)} ${GAME.RANKS[prevBest.rank].name} · ${prevBest.periods} periode` : '');
  GAME.showModal(`${R.ico} Tantangan Selesai!`, `<div style="text-align:center;font-size:14px">
    <div style="font-size:52px">${ch.ico}${R.ico}</div><h3 style="color:var(--teal)">${ch.name}</h3>
    <p>Target tercapai dalam <b>${periods}</b> dari ${ch.limit} periode.</p>
    <p style="font-size:20px;margin:8px 0"><b>Peringkat ${R.name}</b></p>
    <p style="font-size:12.5px;color:#5a6675">${bestTxt}</p>
    <div style="font-size:12px;background:#f6faff;border:2px solid #dfe6ee;border-radius:10px;padding:8px;margin:8px 0">
      🥇 ≤ ${ch.ratings.gold} periode · 🥈 ≤ ${ch.ratings.silver} periode · 🥉 selesai</div>
    <button class="big-btn green" onclick="GAME.closeModal()">Lanjut Memerintah</button>
    <button class="big-btn" onclick="GAME.closeModal();GAME.startGame(GAME.newState('challenge','${ch.id}'))">🔄 Main Lagi</button></div>`);
};

/* ---------- PANEL BANGUN ---------- */
const CATS={ pemerintahan:'Pemerintahan & Keuangan', perdagangan:'Perdagangan', produksi:'Produksi', pelayanan:'Pelayanan Masyarakat', infra:'Infrastruktur & Lingkungan' };
function buildBenefit(def){
  const out=[];
  if(def.income) out.push('💰 '+GAME.fmtRp(def.income));
  if(def.jobs) out.push('👷 '+def.jobs+' kerja');
  if(def.produces){ const g=GAME.GOODS[def.produces.good]; out.push(g.icon+' +'+def.produces.perLevel+' '+g.name); }
  if(def.storage) out.push('📦 +'+def.storage);
  if(def.popPerLevel) out.push('👥 +'+def.popPerLevel);
  if(def.serviceEdu) out.push('🎓 '+def.serviceEdu);
  if(def.serviceHealth) out.push('🏥 '+def.serviceHealth);
  if(def.power) out.push('⚡ +'+def.power+' MW');
  if(def.welfare) out.push('❤️ +'+def.welfare);
  if(def.tradeBoost) out.push('🛒 penjualan');
  return out.slice(0,3).join(' · ');
}
function spriteBBox(spr){
  if(spr._bbox) return spr._bbox;
  let bb={x:0,y:0,w:spr.width,h:spr.height};
  try{
    const w=spr.width, h=spr.height, d=spr.getContext('2d').getImageData(0,0,w,h).data;
    let x0=w,y0=h,x1=0,y1=0;
    for(let y=0;y<h;y+=2) for(let x=0;x<w;x+=2){
      if(d[(y*w+x)*4+3]>12){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
    }
    if(x1>=x0 && y1>=y0) bb={x:Math.max(0,x0-2),y:Math.max(0,y0-2),w:x1-x0+5,h:y1-y0+5};
  }catch(e){ /* canvas file:// bisa ter-taint — pakai ukuran penuh */ }
  return (spr._bbox=bb);
}
function drawBuildPreview(cv,id){
  const ctx=cv.getContext('2d'); ctx.clearRect(0,0,cv.width,cv.height);
  if(id==='jalan'){ ctx.drawImage(GAME.getTileCanvas('road',{}),0,30,160,90); return; }
  const spr=GAME.getSprite(id,1);
  if(!spr){
    ctx.fillStyle='#eef5fa'; ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#8a97a8'; ctx.font='bold 12px Segoe UI, sans-serif'; ctx.textAlign='center';
    ctx.fillText('Memuat aset…', cv.width/2, cv.height/2);
    return;
  }
  const bb=spriteBBox(spr);
  const s=Math.min((cv.width-14)/bb.w, (cv.height-18)/bb.h);
  const tw=bb.w*s, th=bb.h*s, x=(cv.width-tw)/2, y=cv.height-th-4;
  ctx.save(); ctx.globalAlpha=.16; ctx.fillStyle='#43aa55';
  ctx.beginPath(); ctx.ellipse(cv.width/2, cv.height-8, Math.max(16,tw*.34), 5, 0,0,7); ctx.fill();
  ctx.restore();
  ctx.drawImage(spr, bb.x, bb.y, bb.w, bb.h, x, y, tw, th);
}
GAME.openBuild = function(S){
  let h='';
  for(const cat of Object.keys(CATS)){
    const list = GAME.BUILDINGS.filter(b=>b.cat===cat && !b.locked);
    if(!list.length) continue;
    h+=`<div class="cat-title">${CATS[cat]}</div><div class="bld-grid">`;
    for(const b of list){
      const ok = S.isUnlocked(b.id);
      const benefit = buildBenefit(b);
      const placeTag = b.onWater ? '🌊 1 petak air'
        : (GAME.buildingIsTall && GAME.buildingIsTall(b.id)) ? '📐 1 petak · beri jarak menara'
        : '📐 1 petak';
      h+=`<div class="bld-card ${ok?'':'locked'} ${U.buildSel===b.id?'sel':''}" data-id="${b.id}">
        <canvas width="160" height="150" data-spr="${b.id}"></canvas>
        <div class="nm">${b.icon} ${b.name}</div>
        <div class="cs">${ok?GAME.fmtRp(b.cost||0):'🔒 Bab '+(b.unlockCh||'?')}</div>
        <div class="bn">${benefit?benefit+' · ':''}${placeTag}</div>
        <div class="ds">${b.desc}</div>
        <div class="act">${ok?'Bangun ▸':'Terkunci'}</div></div>`;
    }
    h+=`</div>`;
  }
  h+=`<div class="build-foot"><span>Ketuk kartu untuk mulai menempatkan di lokasi yang sesuai.</span><button onclick="GAME.closeModal()">✕ Batal</button></div>`;
  GAME.showModal('🔨 Pilih Bangunan', h);
  const drawPreviews=()=>document.querySelectorAll('.bld-card canvas').forEach(cv=>drawBuildPreview(cv,cv.dataset.spr));
  drawPreviews();
  GAME.whenSvgReady(drawPreviews);
  document.querySelectorAll('.bld-card:not(.locked)').forEach(el=>{
    el.onclick=()=>{ GAME.SFX.click();
      if(U.buildSel===el.dataset.id){ U.buildSel=null; GAME.closeModal(); }
      else { U.buildSel=el.dataset.id; GAME.closeModal(); GAME.enterBuildMode(); }
    };
  });
};
GAME.enterBuildMode = function(){
  const def=GAME.BUILDById[U.buildSel];
  const span=$('buildHint').querySelector('span');
  const tall=GAME.buildingIsTall && GAME.buildingIsTall(U.buildSel);
  if(span) span.textContent = def&&def.onWater
    ? 'Ketuk petak air kosong untuk menempatkan · ketuk dua kali / Esc untuk batal'
    : tall
      ? 'Menara tinggi: beri jarak 1 petak dari menara lain agar siluet jelas · ketuk dua kali / Esc batal'
      : 'Ketuk lahan kosong untuk membangun · ketuk dua kali / Esc untuk batal';
  $('buildHint').classList.remove('hidden');
};
GAME.exitBuildMode = function(){ U.buildSel=null; $('buildHint').classList.add('hidden'); };
function cl_durFor(def){ return def.cost>=15e9?14 : def.cost>=6e9?9 : def.cost>=2e9?6 : 4; } // jam simulasi
GAME.tryPlace = function(S,gx,gy){
  const id=U.buildSel; if(!id) return;
  const def=GAME.BUILDById[id], cell=GAME.cellAt(S,gx,gy);
  const wrongTerrain = !cell || (def.onWater ? cell.terrain!=='water' : cell.terrain!=='grass');
  if(wrongTerrain || cell.b || cell.road){ GAME.SFX.error(); GAME.toast(def.onWater?'Perairan tidak tersedia di sini!':'Lahan tidak tersedia di sini!','warn'); return; }
  if(GAME.tallSpacingBlocked && GAME.tallSpacingBlocked(S,id,gx,gy)){
    GAME.SFX.error();
    GAME.toast('Beri jarak 1 petak dari menara lain agar siluet gedung tinggi tetap jelas.','warn',3200);
    return;
  }
  if(S.treasury < def.cost){ GAME.SFX.error(); GAME.toast(`Kas tidak cukup! Butuh ${GAME.fmtRp(def.cost)}`,'warn'); return; }
  S.treasury -= def.cost; S.builtCount++;
  if(def.flat){ cell.road=true; }
  else { cell.b={id, level:1, born:Date.now(), done:false, cT:0, cDur:cl_durFor(def)};
    GAME.toast(`🚧 ${def.name} dibangun — biaya ${GAME.fmtRp(def.cost)} sudah dibayar. Tunggu konstruksi selesai sebelum bangunan beroperasi.`,'warn',4200); }
  GAME.SFX.build(); GAME.floatText(gx,gy,'-'+GAME.fmtRp(def.cost),'#e63946');
  GAME.updateHUD(S); GAME.save(S);
};

/* ---------- KARTU BANGUNAN ---------- */
GAME.showBuildingInfo = function(S,gx,gy){
  const cell=GAME.cellAt(S,gx,gy); const bi=$('buildInfo');
  if(!cell || (!cell.b && !cell.road)){ bi.classList.add('hidden'); U.sel=null; return; }
  U.sel=[gx,gy];
  if(cell.road){ bi.innerHTML=`<div class="bi-head">🛣️ Jalan <button onclick="GAME.demolish(${gx},${gy})">✕</button></div>
    <div class="bi-body">Melancarkan distribusi barang. Setiap 4 jalan menaikkan efisiensi produksi.</div>`;
    bi.classList.remove('hidden'); return; }
  const b=cell.b, def=GAME.BUILDById[b.id];
  const upCost = Math.round(def.cost*0.8*b.level) || 2e9*b.level;
  const rows = def.onWater ? [['Lokasi','🌊 Perairan']] : [];
  if(b.done===false){
    const pct=Math.min(100, Math.round(((b.cT||0)/(b.cDur||8))*100));
    rows.push(['Status', `🚧 Dalam konstruksi — ${pct}%`]);
    rows.push(['Operasional', 'Belum berjalan (tunggu selesai)']);
  } else {
    rows.push(['Status', '✅ Beroperasi']);
    rows.push(['Operasional', GAME.fmtRp(def.ops*b.level)+'/periode']);
  }
  if(def.produces) rows.push(['Produksi', `${GAME.GOODS[def.produces.good].icon} ${def.produces.perLevel*b.level} unit/periode`]);
  if(def.jobs) rows.push(['Pekerja', (def.jobs*b.level)+' orang']);
  if(def.popPerLevel) rows.push(['Penduduk', '+'+def.popPerLevel*b.level+' jiwa']);
  if(def.storage) rows.push(['Gudang', '+'+def.storage*b.level+' unit']);
  if(def.power) rows.push(['Listrik', '+'+def.power+' MW']);
  if(def.powerUse) rows.push(['Butuh listrik', def.powerUse*b.level+' MW']);
  if(def.serviceEdu) rows.push(['Pendidikan', def.serviceEdu*b.level+' warga']);
  if(def.serviceHealth) rows.push(['Kesehatan', def.serviceHealth*b.level+' warga']);
  if(def.income) rows.push(['Pendapatan', GAME.fmtRp(def.income*b.level)+'/periode']);
  if(def.welfare) rows.push(['Kesejahteraan', '+'+def.welfare+' poin']);
  bi.innerHTML=`<div class="bi-head">${def.icon} ${def.name} · Lv ${b.level} <button onclick="GAME.closeBuildingInfo()">✕</button></div>
   <div class="bi-body">${rows.map(r=>`<div class="bi-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}
   <div style="font-size:11.5px;color:#5a6675;margin-top:6px">${def.desc}</div></div>
   <div class="bi-actions">
     <button class="btn-up" ${b.level>=GAME.CONST.MAX_LEVEL||S.treasury<upCost?'disabled':''} onclick="GAME.upgrade(${gx},${gy})">
       ${b.level>=GAME.CONST.MAX_LEVEL?'Level Maks':'⬆ Tingkatkan '+GAME.fmtRp(upCost)}</button>
     ${def.id==='kantor'?'':`<button class="btn-sell" onclick="GAME.demolish(${gx},${gy})">Hapus<br><small>kembali 50%</small></button>`}
   </div>`;
  bi.classList.remove('hidden');
};
GAME.closeBuildingInfo = ()=>{ $('buildInfo').classList.add('hidden'); U.sel=null; };
GAME.upgrade = function(gx,gy){
  const S=U.S, cell=GAME.cellAt(S,gx,gy); if(!cell||!cell.b) return;
  const def=GAME.BUILDById[cell.b.id], cost=Math.round(def.cost*0.8*cell.b.level)||2e9*cell.b.level;
  if(cell.b.level>=GAME.CONST.MAX_LEVEL || S.treasury<cost){ GAME.SFX.error(); return; }
  S.treasury-=cost; cell.b.level++; GAME.SFX.build(); GAME.floatText(gx,gy,'⬆ Lv'+cell.b.level,'#2a9d8f');
  GAME.showBuildingInfo(S,gx,gy); GAME.updateHUD(S); GAME.save(S);
};
GAME.demolish = function(gx,gy){
  const S=U.S, cell=GAME.cellAt(S,gx,gy); if(!cell) return;
  if(cell.b){ const def=GAME.BUILDById[cell.b.id];
    if(def.id==='kantor'){ GAME.toast('Kantor Pemerintahan tidak boleh dihapus!','warn'); return; }
    S.treasury += Math.round(def.cost*0.5*cell.b.level); cell.b=null;
  } else if(cell.road) cell.road=false;
  GAME.SFX.coin(); GAME.closeBuildingInfo(); GAME.updateHUD(S); GAME.save(S);
};

/* ---------- PANEL EKONOMI ---------- */
GAME.openEconomy = function(S){
  S.flags.sawBudget=true;
  const D=GAME.derive(S);
  let h=`<div class="ec-block"><h3>📊 Laporan Anggaran (per periode)</h3>
   <div class="rep-row"><span>Pendapatan (pajak ${Math.round(S.taxRate*100)}% + usaha + administrasi)</span><span class="v pos">${GAME.fmtRp(S.last.income)}</span></div>
   <div class="rep-row"><span>Pengeluaran (operasional + layanan publik)</span><span class="v neg">${GAME.fmtRp(-S.last.expense)}</span></div>
   <div class="rep-row"><b>Kas Negara</b><b style="color:${S.treasury>=0?'var(--teal)':'var(--red)'}">${GAME.fmtRp(S.treasury)}</b></div>
   <div class="rep-row"><span>Surplus/defisit beruntun</span><span>${S.surplusStreak>0?`<b class="pos">surplus ${S.surplusStreak} periode</b>`:S.deficitStreak>0?`<b class="neg">defisit ${S.deficitStreak} periode</b>`:'—'}</span></div></div>
  <div class="ec-block"><h3>🏪 Harga, Stok & Pasar</h3><div class="ec-scroll"><table class="ec ec-wide">
   <tr><th>Barang</th><th>Harga</th><th>vs Dasar</th><th>Stok</th><th>Permintaan</th><th>Produksi</th></tr>`;
  for(const [g,def] of Object.entries(GAME.GOODS)){
    const G=S.goods[g], pct=Math.round(G.price/def.base*100);
    const col = pct>130?'neg':pct<90?'pos':'';
    let demand=G.demand;
    if(demand==null){
      let pc=def.perCapita; if(g==='daging') pc*=0.5+S.stats.welfare/100;
      const pf=Math.max(0.35,Math.min(2.2,Math.pow(def.base/G.price,def.elastic)));
      demand=D.pop*pc*pf*S.mod.trade;
    }
    h+=`<tr><td>${def.icon} ${def.name}</td><td>Rp${Math.round(G.price).toLocaleString('id')}</td>
        <td class="${col}">${pct}%</td><td>${Math.round(G.stock)}</td><td>${Math.round(demand)}</td><td>${Math.round(D.byGood[g]||0)}</td></tr>`;
  }
  h+=`</table></div><p style="font-size:11.5px;color:#5a6675;margin-top:6px">💡 Bila permintaan &gt; penawaran, harga naik; bila stok melimpah, harga turun. Keseimbangan tercapai saat keduanya sama. Kolom produksi = kapasitas per periode. Kapasitas gudang: ${D.storage} unit.</p></div>
  <div class="ec-block"><h3>🇮🇩 Kesejahteraan & Ketahanan</h3>
   <div class="rep-row"><span>🌾 Ketersediaan pangan</span><b class="${S.stats.foodSec>=80?'pos':S.stats.foodSec<60?'neg':''}">${Math.round(S.stats.foodSec)}%</b></div>
   <div class="stockbar"><i style="width:${Math.max(2,Math.min(100,S.stats.foodSec))}%;background:${S.stats.foodSec>=80?'var(--green)':S.stats.foodSec<60?'var(--red)':'var(--gold)'}"></i></div>
   <div class="rep-row"><span>📈 Pertumbuhan ekonomi</span><b class="${(S.stats.growth||0)>=0?'pos':'neg'}">${typeof S.stats.growth==='number'?(S.stats.growth>=0?'+':'')+S.stats.growth.toFixed(1)+'%':'— (setelah 1 periode)'}</b></div>
   <div class="rep-row"><span>❤️ Kesejahteraan masyarakat</span><b class="${S.stats.welfare>=65?'pos':S.stats.welfare<40?'neg':''}">${S.stats.welfare}%</b></div>
   <div class="rep-row"><span>🎯 Inflasi (target &lt; 5%)</span><b class="${S.stats.inflasi<5?'pos':S.stats.inflasi>=8?'neg':''}">${S.stats.inflasi.toFixed(1)}%</b></div>
   <div class="rep-row"><span>👥 Pengangguran</span><b class="${S.stats.unemp<8?'pos':S.stats.unemp>=15?'neg':''}">${S.stats.unemp.toFixed(1)}%</b></div></div>
  <div class="ec-block"><h3>👥 Tenaga Kerja</h3>
   <div class="rep-row"><span>Penduduk</span><b>${D.pop.toLocaleString('id')} jiwa</b></div>
   <div class="rep-row"><span>Angkatan kerja</span><b>${D.labor.toLocaleString('id')} orang</b></div>
   <div class="rep-row"><span>Lowongan dari bangunan</span><b>${D.jobsNeed} posisi</b></div>
   <div class="rep-row"><span>Pekerja formal + informal</span><b>${Math.round(D.employed)} orang</b></div>
   <div class="rep-row"><span>Tingkat pengangguran</span><b class="${D.unemp>12?'neg':'pos'}">${D.unemp.toFixed(1)}%</b></div>
   <div class="rep-row"><span>⚡ Listrik (pasokan/kebutuhan)</span><b class="${D.powerOK?'pos':'neg'}">${D.powerSupply} / ${D.powerDemand} MW</b></div></div>
  <div class="ec-block"><h3>📈 Grafik Perkembangan</h3>
   <div class="chart-wrap"><canvas id="chart1" width="600" height="130"></canvas></div>
   <div class="legend" style="margin-top:6px"><span><i style="background:#2a9d8f"></i>Kesejahteraan</span><span><i style="background:#e63946"></i>Inflasi %</span><span><i style="background:#1d3557"></i>Pengangguran %</span></div>
   <div class="chart-wrap" style="margin-top:10px"><canvas id="chart2" width="600" height="130"></canvas></div>
   <div class="legend" style="margin-top:6px"><span><i style="background:#e9c46a"></i>Kas (M)</span><span><i style="background:#43aa55"></i>Produksi unit</span></div></div>`;
  GAME.showModal('💰 Ekonomi Negara', h);
  GAME.drawChart(S);
};
GAME.drawChart = function(S){
  const hist=S.history;
  if(hist.length<2){
    ['chart1','chart2'].forEach(id=>{
      const cv=$(id); if(!cv) return; const x=cv.getContext('2d'); const W=cv.width, H=cv.height;
      x.clearRect(0,0,W,H);
      x.strokeStyle='#e3e8ef'; for(let i=1;i<4;i++){ x.beginPath(); x.moveTo(0,H*i/4); x.lineTo(W,H*i/4); x.stroke(); }
      x.fillStyle='#8895a5'; x.font='bold 16px Segoe UI, sans-serif'; x.textAlign='center';
      x.fillText('Grafik muncul setelah 1 periode — tekan Akhiri Periode', W/2, H/2+5);
    });
    return;
  }
  const line=(id, series, colors, max)=>{
    const cv=$(id); if(!cv) return; const x=cv.getContext('2d');
    const W=cv.width, H=cv.height; x.clearRect(0,0,W,H);
    x.strokeStyle='#e3e8ef'; for(let i=1;i<4;i++){ x.beginPath(); x.moveTo(0,H*i/4); x.lineTo(W,H*i/4); x.stroke(); }
    series.forEach((s,si)=>{
      const mx=Math.max(...s.d,1); x.strokeStyle=colors[si]; x.lineWidth=2.5; x.beginPath();
      s.d.forEach((v,i)=>{ const px=10+(W-20)*i/Math.max(1,s.d.length-1), py=H-12-(H-24)*v/mx;
        i?x.lineTo(px,py):x.moveTo(px,py); });
      x.stroke();
    });
  };
  line('chart1',[{d:hist.map(h=>h.welfare)},{d:hist.map(h=>Math.max(0,h.inflasi))},{d:hist.map(h=>h.unemp)}],['#2a9d8f','#e63946','#1d3557']);
  line('chart2',[{d:hist.map(h=>Math.max(0,h.treasury)/1e9)},{d:hist.map(h=>h.production)}],['#e9c46a','#43aa55']);
};

/* ---------- PANEL KEBIJAKAN ---------- */
GAME.openPolicy = function(S){
  const h=`
  <div class="pol-item"><h4> Tarif Pajak <span class="pol-val" id="taxVal">${Math.round(S.taxRate*100)}%</span></h4>
   <p>Pajak tinggi → pendapatan negara naik, tetapi daya beli warga dan keuntungan usaha tertekan. Pajak rendah sebaliknya.</p>
   <input type="range" id="taxRange" min="5" max="25" step="1" value="${Math.round(S.taxRate*100)}"></div>
  <div class="pol-item"><h4>🌾 Subsidi Pertanian <b id="subTani">${S.subs.pertanian?'AKTIF (−2 M/periode)':'NONAKTIF'}</b></h4>
   <p>Membantu petani menekan biaya produksi: hasil pangan +25%, tetapi membebani anggaran negara.</p>
   <div class="seg"><button id="subTaniOn" class="${S.subs.pertanian?'on':''}">Aktifkan</button><button id="subTaniOff" class="${!S.subs.pertanian?'on':''}">Matikan</button></div></div>
  <div class="pol-item"><h4>🛒 Subsidi Kebutuhan Pokok <b id="subPangan">${S.subs.pangan?'AKTIF (−2 M/periode)':'NONAKTIF'}</b></h4>
   <p>Menahan harga beras & sayur agar terjangkau warga. Berguna saat inflasi tinggi, tetapi boros anggaran bila terus-menerus.</p>
   <div class="seg"><button id="subPanganOn" class="${S.subs.pangan?'on':''}">Aktifkan</button><button id="subPanganOff" class="${!S.subs.pangan?'on':''}">Matikan</button></div></div>
  <div class="pol-item"><h4>ℹ️ Catatan Menteri</h4>
   <p id="polTip">${GAME.TIPS[Math.floor(Math.random()*GAME.TIPS.length)]}</p></div>`;
  GAME.showModal('📜 Kebijakan Ekonomi', h);
  $('taxRange').oninput=e=>{ S.taxRate=+e.target.value/100; $('taxVal').textContent=e.target.value+'%'; };
  $('taxRange').onchange=()=>{ GAME.SFX.click(); GAME.save(S); };
  const tog=(key,v)=>{ S.subs[key]=v; GAME.SFX.click(); GAME.save(S); GAME.openPolicy(S); };
  $('subTaniOn').onclick=()=>tog('pertanian',true); $('subTaniOff').onclick=()=>tog('pertanian',false);
  $('subPanganOn').onclick=()=>tog('pangan',true); $('subPanganOff').onclick=()=>tog('pangan',false);
};

/* ---------- PANEL MISI ---------- */
GAME.openMissions = function(S){
  let h='';
  if(S.mode==='story'){
    if(S.flags.storyDone){
      h+=`<div class="mis"><div class="mis-head"><span>👑 PRESIDEN EKONOMI</span><span class="st selesai">SELESAI</span></div>
        <div class="mis-body"><div>Seluruh 7 bab telah tuntas. Nusantara Raya menjadi negara makmur, stabil, dan sejahtera.</div>
        <div class="rw">Terus kembangkan kotamu, atau buktikan kemampuanmu di Challenge Mode.</div></div></div>`;
    } else {
      h+=`<div class="mis"><div class="mis-head"><span>${GAME.CHAPTERS.find(c=>c.id===S.chapter).title}</span><span class="st aktif">AKTIF</span></div><div class="mis-body">`;
      GAME.Story.objectives(S).forEach(o=> h+=`<div class="obj ${o.ok?'ok':''}">${o.ok?'✔':'○'} ${o.t}</div>`);
      h+=`<div class="rw">🎁 Hadiah: ${GAME.fmtRp(GAME.CHAPTERS.find(c=>c.id===S.chapter).rewardMoney)} + bangunan baru</div></div>`;
      GAME.CHAPTERS.forEach(c=>{ if(c.id>S.chapter){
        h+=`<div class="mis"><div class="mis-head"><span>${c.title}</span><span class="st terkunci">TERKUNCI</span></div><div class="mis-body" style="color:#8895a5">Materi: ${c.topic}</div></div>`; }});
    }
  } else if(S.mode==='challenge'){
    const c=GAME.CHALLENGES.find(x=>x.id===S.challenge);
    const best=GAME.bestFor(c.id);
    const st = !S.challengeDone ? `<span class="st aktif">⏳ ${GAME.chalLeft(S)} periode</span>`
      : S.challengeWon ? `<span class="st selesai">✅ SELESAI (${S.challengePeriods}p)</span>`
      : `<span class="st terkunci">⏰ GAGAL</span>`;
    h+=`<div class="mis"><div class="mis-head"><span>${c.ico} ${c.name}</span>${st}</div><div class="mis-body">
      <div>${c.d}</div>
      <div class="rw">${best?`${GAME.rankBadge(best.rank)} Rekor terbaik: ${GAME.RANKS[best.rank].name} · ${best.periods} periode`:'Belum ada rekor tersimpan.'}</div>
      <div class="rw">🥇 ≤ ${c.ratings.gold} periode · 🥈 ≤ ${c.ratings.silver} periode · 🥉 selesai</div></div></div>`;
  } else {
    h+=`<p style="font-size:13.5px;color:#5a6675;margin-bottom:10px">Mode Free Build — tidak ada misi cerita. Kejar pencapaian di bawah!</p>`;
  }
  h+=`<div class="cat-title">🎯 Misi Tambahan</div>`;
  GAME.Story.SIDE.forEach(m=>{
    const got=S.achievements[m.once];
    h+=`<div class="ach ${got?'got':''}"><div class="ico">${got?'✅':'🎯'}</div><div><h4>${m.t}</h4><p>${m.d} · ${m.rw}</p></div></div>`;
  });
  h+=`<div class="cat-title">🏅 Pencapaian</div>`;
  GAME.ACHIEVEMENTS.forEach(a=>{
    const got=S.achievements[a.id];
    h+=`<div class="ach ${got?'got':''}"><div class="ico">${a.ico}</div><div><h4>${a.name}</h4><p>${a.d} · Hadiah ${GAME.fmtRp(a.reward)}</p></div></div>`;
  });
  GAME.showModal('🎯 Misi & Pencapaian', h);
};

/* ---------- ENSIKLOPEDIA ---------- */
GAME.openEnc = function(){
  let h=`<div class="enc-list">`+GAME.ENCY.map((e,i)=>`<div class="enc-item" data-i="${i}">📖 ${e.t}</div>`).join('')+`</div>`;
  GAME.showModal('📖 Ensiklopedia Ekonomi', h);
  document.querySelectorAll('.enc-item').forEach(el=>el.onclick=()=>{
    const e=GAME.ENCY[+el.dataset.i]; GAME.SFX.pop();
    GAME.showModal('📖 '+e.t, `<div class="enc-art"><h3>${e.t}</h3><p>${e.b}</p><div class="ex"><b>Contoh di game:</b> ${e.ex}</div>
      <p style="font-size:12px;color:#5a6675">Catatan: model dalam game disederhanakan untuk belajar; ekonomi nyata dipengaruhi lebih banyak faktor.</p>
      <button class="big-btn" onclick="GAME.openEnc()">← Daftar materi</button></div>`);
  });
};

/* ---------- MENU JEDA / PENGATURAN / KREDIT ---------- */
GAME.openPause = function(S){
  GAME.showModal('⏸ Menu Istirahat', `
   <button class="big-btn green" onclick="GAME.closeModal()">▶ Lanjutkan</button>
   <button class="big-btn" onclick="GAME.save(GAME.ui.S);GAME.toast('💾 Progres disimpan','win')">💾 Simpan</button>
   <button class="big-btn" onclick="GAME.openSettings(GAME.ui.S)">⚙️ Pengaturan</button>
   <button class="big-btn" onclick="GAME.openEnc()">📖 Ensiklopedia</button>
   <button class="big-btn red" onclick="GAME.confirmQuit()">🏠 Kembali ke Menu Utama</button>`);
};
GAME.confirmQuit = function(){
  GAME.showModal('Kembali ke Menu?','<p style="text-align:center">Progres akan disimpan terlebih dahulu.</p><button class="big-btn green" onclick="GAME.save(GAME.ui.S);GAME.toMenu()">Simpan & Keluar</button><button class="big-btn" onclick="GAME.closeModal()">Batal</button>');
};
GAME.openSettings = function(S){
  const snd = S? S.settings.sound : GAME.audioPrefs.sound;
  const mus = S? S.settings.music : GAME.audioPrefs.music;
  GAME.showModal('⚙️ Pengaturan', `
   <div class="set-row"><span>🔊 Efek Suara</span><label class="switch"><input type="checkbox" id="setSnd" ${snd?'checked':''}><i></i></label></div>
   <div class="set-row"><span>🎵 Musik Latar</span><label class="switch"><input type="checkbox" id="setMus" ${mus?'checked':''}><i></i></label></div>
   <div class="set-row"><span>🇮🇩 Bahasa</span><b>Indonesia</b></div>
   <button class="big-btn" onclick="GAME.closeModal()">Selesai</button>`);
  $('setSnd').onchange=e=>{
    const v=e.target.checked;
    if(S) S.settings.sound=v;
    GAME.audioPrefs.sound=v; GAME.saveAudioPrefs();
    GAME.setSound(v);
    if(v && (S?S.settings.music:GAME.audioPrefs.music)) GAME.startMusic();
    if(S) GAME.save(S);
  };
  $('setMus').onchange=e=>{
    const v=e.target.checked;
    if(S) S.settings.music=v;
    GAME.audioPrefs.music=v; GAME.saveAudioPrefs();
    if(v && (S?S.settings.sound:GAME.audioPrefs.sound)) GAME.startMusic(); else GAME.stopMusic();
    if(S) GAME.save(S);
  };
};
GAME.openCredits = function(){
  GAME.showModal('ℹ️ Kredit', `<div style="text-align:center;font-size:14px;line-height:1.7">
   <h3 style="color:var(--teal)">PRESIDENT OF ECONOMY</h3>
   <p>Game edukasi simulasi ekonomi &amp; pembangunan kota<br>Bab: <b>Nusantara Raya</b> — Belajar Ekonomi Lewat Bermain</p>
   <p style="margin-top:10px">Gaya visual mengacu pada <b>“Lembar Aset Game Ekonomi Nusantara”</b>:<br>
   bangunan kartun isometrik, karakter Presiden, Menteri Ekonomi,<br>Pak Budi (Petani), Bu Rina (Pedagang), dan Kepala Daerah.</p>
   <p style="margin-top:10px;font-size:12.5px;color:#5a6675">Semua angka ekonomi dalam game adalah nilai simulasi untuk pembelajaran, bukan data ekonomi nyata.</p>
   <button class="big-btn" onclick="GAME.closeModal()">Tutup</button></div>`);
};

/* sinkronkan tombol toolbar */
function syncToolbar(){ document.querySelectorAll('.tool-btn').forEach(b=>b.classList.toggle('active', b.dataset.panel===U.panel)); }
GAME.openPanel = function(name){
  const S=U.S; if(!S) return; GAME.SFX.open();
  U.panel=name; syncToolbar();
  ({ build:()=>GAME.openBuild(S), economy:()=>GAME.openEconomy(S), policy:()=>GAME.openPolicy(S),
     missions:()=>GAME.openMissions(S), encyclopedia:()=>GAME.openEnc(), pauseMenu:()=>GAME.openPause(S) }[name]||(()=>{}))();
};
