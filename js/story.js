/* ============================================================
   STORY — dialog karakter, 7 bab, kuis edukasi
   ============================================================ */
window.GAME = window.GAME || {};
const ST = GAME.Story = { queue:[], active:false, onDone:null, typing:null, shown:'', idx:0 };

ST.play = function(lines, onDone){
  ST.queue = lines.slice(); ST.onDone = onDone||null; ST.active = true;
  document.getElementById('dialogBox').classList.remove('hidden');
  ST._next();
};
ST._next = function(){
  const box=document.getElementById('dialogBox');
  if(!ST.queue.length){ ST.active=false; box.classList.add('hidden');
    const cb=ST.onDone; ST.onDone=null; if(cb) cb(); return; }
  const [who,text]=ST.queue.shift();
  const ch=GAME.CHARACTERS[who]||GAME.CHARACTERS.menteri;
  document.getElementById('dlgName').textContent=ch.name;
  const p=document.getElementById('dlgPortrait'); p.innerHTML=''; p.appendChild(GAME.getPortrait(who));
  ST.shown=text; ST.idx=0;
  const t=document.getElementById('dlgText'); t.textContent='';
  clearInterval(ST.typing);
  ST.typing=setInterval(()=>{ ST.idx+=2; t.textContent=ST.shown.slice(0,ST.idx);
    if(ST.idx>=ST.shown.length){ clearInterval(ST.typing); } },18);
  document.getElementById('dlgChoices').innerHTML='';
};
ST._advance = function(){
  if(!ST.active) return;
  if(ST.idx<ST.shown.length){ ST.idx=ST.shown.length; document.getElementById('dlgText').textContent=ST.shown; clearInterval(ST.typing); return; }
  ST._next();
};

/* ---------- BAB ---------- */
ST.reset = function(){
  ST._run = (ST._run||0) + 1;
  clearInterval(ST.typing); ST.queue=[]; ST.active=false; ST.onDone=null;
  const box=document.getElementById('dialogBox'); if(box) box.classList.add('hidden');
};
ST.startChapter = function(S){
  S.flags.introSeen = S.flags.introSeen || {};
  const firstTime = !S.flags.introSeen[S.chapter];
  // skenario hanya diterapkan sekali per bab — jangan diulang saat memuat save
  if(firstTime){
    if(S.chapter===2){ S.goods.beras.stock=30; S.goods.beras.price=16500; S.goods.sayur.price=10500; }
    if(S.chapter===3){ S.popBonus += 600; }
    if(S.chapter===4){ Object.values(S.goods).forEach(g=>g.price*=1.18); S.stats.inflasi=9.5; }
    if(S.chapter===6){ S.mod.ops=1.18; S.mod.timer.ops=6; }
    S.flags.introSeen[S.chapter]=true;
    if(S.chapter>1) GAME.save(S);
  }
  const intro = GAME.STORY_INTRO[S.chapter];
  if(firstTime && intro){
    const run = ST._run = (ST._run||0) + 1;
    setTimeout(()=>{ if(run===ST._run) ST.play(intro.map(l=>l)); }, 400);
  }
};
ST.objectives = function(S){
  const ch=GAME.CHAPTERS.find(c=>c.id===S.chapter);
  if(!ch) return [];
  return ch.objectives.map(o=>({ t:o.t, ok:o.f(S) }));
};
ST.allDone = function(S){ return ST.objectives(S).every(o=>o.ok); };
ST.completeChapter = function(S){
  S.chapterPhase='complete';
  const ch=GAME.CHAPTERS.find(c=>c.id===S.chapter);
  GAME.SFX.win();
  const quiz = GAME.QUIZZES[S.chapter]||[];
  const finish = ()=>{
    S.treasury += ch.rewardMoney;
    (ch.rewardUnlock||[]).forEach(id=>{ if(!S.unlocked.includes(id)) S.unlocked.push(id); });
    GAME.toast(`🎉 Bab ${ch.id} selesai! Hadiah ${GAME.fmtRp(ch.rewardMoney)} & bangunan baru terbuka.`,'win',4000);
    GAME.save(S);
    if(S.chapter>=7){ S.flags.storyDone=true;
      ST.play([['menteri','Seluruh bab telah diselesaikan. Gelar PRESIDEN EKONOMI resmi menjadi milikmu!'],['presiden','Terima kasih atas kerja samanya semua. Challenge Mode kini terbuka — uji kemampuanmu lagi!']]);
      GAME.showModal('👑 Lulus dengan Predikat Tertinggi!',
        `<div style="text-align:center"><div style="font-size:64px">🏅</div>
         <h3 style="color:var(--teal);margin:8px 0">PRESIDEN EKONOMI</h3>
         <p>Nusantara Raya menjadi negara makmur, stabil, dan sejahtera di tanganmu.<br>
         Challenge Mode dan seluruh bangunan kini terbuka.</p>
         <button class="big-btn green" onclick="GAME.closeModal()">Lanjutkan Memerintah</button></div>`);
    } else {
      S.chapter++; S.chapterPhase='playing'; GAME.save(S);
      setTimeout(()=>ST.startChapter(S), 900);
    }
  };
  const runQuiz = ()=>{
    if(!quiz.length) return finish();
    ST.showQuiz(quiz, 0, finish);
  };
  ST.play(GAME.STORY_WIN[S.chapter]||[], runQuiz);
};
ST.showQuiz = function(quiz, qi, done){
  if(qi>=quiz.length){ GAME.closeModal(); done(); return; }
  const q=quiz[qi];
  let html=`<div style="font-size:12px;color:var(--orange);font-weight:900;margin-bottom:6px">📝 KUIS EDUKASI · Soal ${qi+1}/${quiz.length}</div>
    <div class="quiz-q">${q.q}</div><div id="quizOpts">`;
  q.o.forEach((o,i)=> html+=`<button class="quiz-opt" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`);
  html+=`</div><div id="quizFb"></div>`;
  GAME.showModal('Uji Pemahaman Ekonomi', html);
  const fb=document.getElementById('quizFb'), opts=document.getElementById('quizOpts');
  opts.querySelectorAll('.quiz-opt').forEach(btn=>{
    btn.onclick=()=>{
      const i=+btn.dataset.i;
      opts.querySelectorAll('.quiz-opt').forEach(b=>b.disabled=true);
      if(i===q.a){ btn.classList.add('right');
        fb.innerHTML=`<div class="quiz-fb ok">✅ Benar! ${q.e}</div><button class="big-btn green" id="quizNext">Lanjut ▸</button>`;
        GAME.SFX.coin();
      } else { btn.classList.add('wrong'); opts.children[q.a].classList.add('right');
        fb.innerHTML=`<div class="quiz-fb no">❌ Belum tepat. ${q.e}</div><button class="big-btn green" id="quizNext">Lanjut ▸</button>`;
        GAME.SFX.error(); }
      document.getElementById('quizNext').onclick=()=>ST.showQuiz(quiz,qi+1,done);
    };
  });
};

/* ---------- misi sampingan (semua mode) ---------- */
ST.SIDE = [
 { t:'Petani Sejahtera', d:'Produksi pangan ≥ 250 unit/periode', f:S=>S.last.production>=250, rw:'Hadiah: +3 M', once:'side_tani' },
 { t:'Kota Produktif', d:'Sediakan ≥ 400 lapangan kerja', f:S=>GAME.derive(S).jobsNeed>=400, rw:'Hadiah: +4 M', once:'side_kerja' },
 { t:'Pasar Stabil', d:'Inflasi < 3% selama 2 periode berturut', f:S=>S.stats.inflasi<3&&S.flags._stab1, rw:'Hadiah: +5 M', once:'side_stabil' },
 { t:'Anggaran Sehat', d:'Surplus 4 periode berturut-turut', f:S=>S.surplusStreak>=4, rw:'Hadiah: +6 M', once:'side_anggaran' },
 { t:'Pendidikan untuk Semua', d:'Akses pendidikan ≥ 80% penduduk', f:S=>GAME.derive(S).eduCap>=GAME.derive(S).pop*0.8, rw:'Hadiah: +5 M', once:'side_edu' },
 { t:'Lingkungan Bersih', d:'Bangun pengelolaan sampah & pengolahan air', f:S=>S.count('persampahan')>=1&&S.count('ipl')>=1, rw:'Hadiah: +4 M', once:'side_env' },
];
ST.tickSide = function(S){
  if(S.stats.inflasi<3){ if(S.flags._stab1){ S.flags._stab2=true; } else S.flags._stab1=true; }
  else { S.flags._stab1=false; S.flags._stab2=false; }
  const cur = ST.SIDE.find(m=>m.t==='Pasar Stabil');
  const check = m => m.t==='Pasar Stabil' ? (m.f(S)&&S.flags._stab2) : m.f(S);
  for(const m of ST.SIDE){
    if(!S.achievements[m.once] && check(m)){
      S.achievements[m.once]=true;
      const amt=parseInt(m.rw.match(/(\d+)/)[1])*1e9; S.treasury+=amt;
      GAME.toast(`🎯 Misi tambahan "${m.t}" selesai! ${GAME.fmtRp(amt)}`,'gold',3500); GAME.SFX.win();
    }
  }
};
