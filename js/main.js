/* ============================================================
   MAIN — boot, input PC/HP, loop, alur mode permainan
   ============================================================ */
window.GAME = window.GAME || {};
const $m = GAME.el;
let S = null;

/* ---------- layar ---------- */
function show(id){ ['mainMenu','modeSelect','gameScreen'].forEach(s=>$m(s).classList.toggle('hidden', s!==id)); }
GAME.toMenu = function(){
  show('mainMenu'); $m('btnContinue').disabled = !GAME.hasSave();
  if(GAME.Story) GAME.Story.reset();
  GAME._afterReport=null;
  S=null; U.S=null; GAME.closeModal(); GAME.closeBuildingInfo(); GAME.exitBuildMode();
};

/* ---------- mulai permainan ---------- */
GAME.startGame = function(state){
  GAME._afterReport=null;
  GAME.closeModal();
  if(GAME.Story) GAME.Story.reset();
  S = GAME.attachHelpers(state); U.S = S;
  show('gameScreen'); GAME.centerCam(); GAME.updateHUD(S);
  GAME.closeBuildingInfo(); GAME.exitBuildMode();
  GAME.City.onStateChange(S);
  GAME.City.paused=false; $m('btnPause').textContent='⏸';
  if(S.mode==='story') GAME.Story.startChapter(S);
  else if(S.mode==='challenge'){
    const ch=GAME.CHALLENGES.find(x=>x.id===S.challenge);
    GAME.toast(`${ch.ico} ${ch.name}: ${ch.d}`,'warn',5000);
  } else GAME.toast('🏗️ Free Build — bangun sepuasnya, Presiden!','win',3500);
  GAME.setSound(!!S.settings.sound);
  if(S.settings.music && S.settings.sound) GAME.startMusic(); else GAME.stopMusic();
  GAME.audioPrefs = { sound:!!S.settings.sound, music:!!S.settings.music };
  GAME.saveAudioPrefs();
};

/* ---------- menu utama ---------- */
$m('btnNewStory').onclick=()=>{ GAME.SFX.click();
  if(GAME.hasSave()){ GAME.showModal('Mulai Baru?','<p style="text-align:center">Save lama akan ditimpa saat kamu menyimpan progres baru.</p><button class="big-btn red" onclick="GAME.closeModal();GAME.startGame(GAME.newState(\'story\'))">Ya, Mulai Bab 1</button><button class="big-btn" onclick="GAME.closeModal()">Batal</button>'); }
  else GAME.startGame(GAME.newState('story'));
};
$m('btnContinue').onclick=()=>{ GAME.SFX.click(); const sv=GAME.load(); if(sv) GAME.startGame(sv); else GAME.toast('Belum ada save!','warn'); };
$m('btnModes').onclick=()=>{ GAME.SFX.click(); show('modeSelect'); renderChallenges(); };
$m('btnEncMenu').onclick=()=>{ GAME.SFX.click(); GAME.openEnc(); };
$m('btnSettingsMenu').onclick=()=>{ GAME.SFX.click(); GAME.openSettings(S); };
$m('btnCredits').onclick=()=>{ GAME.SFX.click(); GAME.openCredits(); };
document.querySelectorAll('[data-back]').forEach(b=>b.onclick=()=>{ GAME.SFX.click(); show(b.dataset.back); });
$m('cardStory').onclick=()=>{ GAME.SFX.click(); GAME.startGame(GAME.newState('story')); };
$m('cardFree').onclick=()=>{ GAME.SFX.click(); GAME.startGame(GAME.newState('free')); };
$m('cardChallenge').onclick=()=>{ GAME.SFX.click(); $m('challengeList').classList.toggle('hidden'); };
function renderChallenges(){
  $m('challengeList').innerHTML = `<div class="cat-title">🏆 Pilih Tantangan</div>` + GAME.CHALLENGES.map(c=>{
    const best=GAME.bestFor(c.id);
    const st = best ? `<span class="st selesai">${GAME.rankBadge(best.rank)} ${GAME.RANKS[best.rank].name} · ${best.periods}p</span>`
      : `<span class="st aktif">⏳ ${c.limit} periode</span>`;
    return `<div class="mis" style="cursor:pointer" data-ch="${c.id}">
      <div class="mis-head"><span>${c.ico} ${c.name}</span>${st}</div>
      <div class="mis-body">${c.d}
        <div class="rw">🥇 ≤${c.ratings.gold} periode · 🥈 ≤${c.ratings.silver} periode · 🥉 selesai</div></div></div>`;
  }).join('');
  $m('challengeList').querySelectorAll('[data-ch]').forEach(el=>el.onclick=()=>{ GAME.SFX.click(); GAME.startGame(GAME.newState('challenge', el.dataset.ch)); });
}

/* ---------- toolbar & HUD buttons ---------- */
document.querySelectorAll('.tool-btn').forEach(b=>b.onclick=()=>{ GAME.SFX.click(); GAME.openPanel(b.dataset.panel); });
$m('btnEndTurn').onclick=()=>{ if(S) GAME.endTurn(S); };
$m('btnMenu').onclick=()=>{ GAME.SFX.click(); GAME.openPause(S); };
$m('missionBanner').onclick=()=>{ if(GAME.ui.S&&!$m('missionBanner').classList.contains('hidden')){ GAME.SFX.click(); GAME.openPanel('missions'); } };
$m('btnPause').onclick=()=>{ if(!S) return; GAME.SFX.click();
  const p=GAME.City.togglePause(); $m('btnPause').textContent = p?'▶':'⏸'; };
$m('btnSpeed').onclick=()=>{ if(!S) return; GAME.SFX.click();
  const s=GAME.City.cycleSpeed(); $m('btnSpeed').textContent = s===1?'▶':(s===2?'▶▶':'▶▶▶');
  GAME.toast(`Kecepatan simulasi ${s}×`,'win',1500); };
$m('dlgNext').onclick=()=>GAME.Story._advance();
$m('dialogBox').addEventListener('pointerdown',e=>{ if(e.target.closest('button'))return; GAME.Story._advance(); });

/* ---------- input peta: mouse + sentuh ---------- */
const cv = $m('world');
let drag=null, pinch=null, moved=false;
cv.addEventListener('wheel', e=>{ e.preventDefault();
  U.camZoom *= e.deltaY>0?0.9:1.1; U.camZoom=Math.max(0.45,Math.min(2.2,U.camZoom));
  GAME.R.cam.zoom = U.camZoom; }, {passive:false});
U.camZoom=1;

cv.addEventListener('pointerdown', e=>{
  if(!S) return;
  if(A_ctxResume) A_ctxResume();
  if(e.pointerType==='touch' && e.isPrimary===false) return;
  drag={ x:e.clientX, y:e.clientY, cx:GAME.R.cam.x, cy:GAME.R.cam.y, id:e.pointerId, t:Date.now() };
  moved=false;
  cv.setPointerCapture(e.pointerId);
});
cv.addEventListener('pointermove', e=>{
  if(!S) return;
  const p=GAME.screenToTile(e.clientX,e.clientY);
  GAME.R.hover = (p.gx>=0&&p.gy>=0&&p.gx<GAME.CONST.GRID_W&&p.gy<GAME.CONST.GRID_H)?p:null;
  if(drag && e.pointerId===drag.id){
    const dx=e.clientX-drag.x, dy=e.clientY-drag.y;
    if(Math.abs(dx)+Math.abs(dy)>9) moved=true;
    if(moved){ GAME.R.cam.x = drag.cx - dx/GAME.R.cam.zoom; GAME.R.cam.y = drag.cy - dy/GAME.R.cam.zoom; }
  }
});
cv.addEventListener('pointerup', e=>{
  if(!S){ drag=null; return; }
  if(drag && !moved && e.pointerType!=='mouse' || (drag && !moved && e.button===0)){
    const p=GAME.screenToTile(e.clientX,e.clientY);
    handleTap(e.clientX,e.clientY,p.gx,p.gy);
  }
  drag=null;
});
cv.addEventListener('contextmenu', e=>{ e.preventDefault(); if(U.buildSel) GAME.exitBuildMode(); });
window.addEventListener('keydown', e=>{
  if(e.key==='Escape'){ GAME.exitBuildMode(); GAME.closeBuildingInfo(); }
});
/* pinch zoom */
let touches={};
cv.addEventListener('touchstart',e=>{ for(const t of e.changedTouches) touches[t.identifier]=t; if(e.touches.length===2){ const [a,b]=[...e.touches]; pinch={d:Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY), z:GAME.R.cam.zoom}; } },{passive:true});
cv.addEventListener('touchmove',e=>{ if(pinch && e.touches.length===2){ const [a,b]=[...e.touches];
  const d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
  GAME.R.cam.zoom=Math.max(0.45,Math.min(2.2,pinch.z*d/pinch.d)); U.camZoom=GAME.R.cam.zoom; } },{passive:true});
cv.addEventListener('touchend',e=>{ if(e.touches.length<2) pinch=null; },{passive:true});

function handleTap(cx,cy,gx,gy){
  if(GAME.Story.active) return;
  // ketuk dua kali (posisi sama) = batalkan mode bangun, sesuai petunjuk di layar
  const now=Date.now();
  if(U.buildSel && GAME._lastTap && now-GAME._lastTap.t<350 && Math.hypot(cx-GAME._lastTap.x,cy-GAME._lastTap.y)<30){
    GAME._lastTap=null; GAME.exitBuildMode(); GAME.toast('Mode bangun dibatalkan','warn',1500); return;
  }
  GAME._lastTap={t:now,x:cx,y:cy};
  // prioritas: ikon keluhan > warga > tile
  const w=GAME.clientToWorld(cx,cy);
  const sp=GAME.City.hitSpot(w.x,w.y);
  if(sp){ GAME.City.showComplaint(sp); return; }
  const npc=GAME.City.hitNPC(w.x,w.y);
  if(npc){ GAME.City.showProfile(npc); return; }
  const cell=GAME.cellAt(S,gx,gy); if(!cell) return;
  if(U.buildSel){
    if(GAME.canPlaceTile(S,gx,gy)) { GAME.tryPlace(S,gx,gy); }
    else {
      const def=GAME.BUILDById[U.buildSel];
      GAME.SFX.error();
      if(GAME.tallSpacingBlocked && GAME.tallSpacingBlocked(S,U.buildSel,gx,gy))
        GAME.toast('Menara tinggi perlu jarak 1 petak dari menara lain agar siluetnya tetap jelas.','warn',3200);
      else
        GAME.toast(def&&def.onWater?'Tidak bisa membangun di sini! Pilih petak air.':'Tidak bisa membangun di sini!','warn');
    }
    return;
  }
  if(cell.b || cell.road) GAME.showBuildingInfo(S,gx,gy);
  else GAME.closeBuildingInfo();
}
/* tombol zoom HP */
$m('btnZoomIn').onclick=()=>{ GAME.R.cam.zoom=Math.min(2.2,GAME.R.cam.zoom*1.2); U.camZoom=GAME.R.cam.zoom; };
$m('btnZoomOut').onclick=()=>{ GAME.R.cam.zoom=Math.max(0.45,GAME.R.cam.zoom/1.2); U.camZoom=GAME.R.cam.zoom; };

/* ---------- loop utama — SATU sumber waktu utk seluruh simulasi ---------- */
let lastT = 0, hudAcc = 0;
function loop(t){
  const dt = lastT? Math.min(0.05,(t-lastT)/1000) : 0.016; lastT=t;
  if(S){ GAME.City.update(S, dt); GAME.drawFrame(S, U);
    hudAcc+=dt; if(hudAcc>=0.5){ hudAcc=0; GAME.updateHUD(S); } }
  requestAnimationFrame(loop);
}
function A_ctxResume(){ const c=window.AudioContext||window.webkitAudioContext; if(c && GAME.__actx) try{GAME.__actx.resume();}catch(e){} }

/* ---------- boot ---------- */
GAME.initRender(cv);
GAME.setSound(!!GAME.audioPrefs.sound);
if(GAME.audioPrefs.music){
  const kick=()=>{ if(GAME.audioPrefs.music&&GAME.audioPrefs.sound) GAME.startMusic(); window.removeEventListener('pointerdown',kick); };
  window.addEventListener('pointerdown',kick,{once:true});
}
$m('btnContinue').disabled = !GAME.hasSave();
show('mainMenu');
loop();
