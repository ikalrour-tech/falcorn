/* ============================================================
   AUDIO — efek suara & musik sintetis (WebAudio, tanpa file)
   ============================================================ */
window.GAME = window.GAME || {};
const A = { ctx:null, musicNodes:[], musicGain:null, on:true };

function actx(){ if(!A.ctx){ try{ A.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ A.on=false; } } return A.ctx; }
function beep(freq, dur, type, vol, slide){
  if(!A.on) return; const c=actx(); if(!c) return;
  const o=c.createOscillator(), g=c.createGain();
  o.type=type||'sine'; o.frequency.value=freq;
  if(slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime+dur);
  g.gain.setValueAtTime(vol||0.12, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime+dur);
  o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime+dur+0.02);
}
GAME.SFX = {
  click(){ beep(660,0.07,'triangle',0.08); },
  open(){ beep(440,0.09,'triangle',0.1); beep(660,0.12,'sine',0.07); },
  build(){ beep(320,0.12,'square',0.06,180); setTimeout(()=>beep(520,0.15,'triangle',0.1,700),90); },
  coin(){ beep(880,0.08,'sine',0.09); setTimeout(()=>beep(1175,0.12,'sine',0.09),70); },
  win(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,0.18,'triangle',0.11),i*110)); },
  error(){ beep(220,0.18,'sawtooth',0.07,140); },
  warn(){ [440,392,440,392].forEach((f,i)=>setTimeout(()=>beep(f,0.14,'square',0.06),i*160)); },
  turn(){ beep(392,0.1,'sine',0.08); setTimeout(()=>beep(523,0.14,'sine',0.09),90); },
  pop(){ beep(700,0.05,'sine',0.07,900); },
};
/* musik latar sederhana: loop akor pentatonik santai */
GAME.startMusic = function(){
  if(!A.on || A.musicNodes.length) return; const c=actx(); if(!c) return;
  A.musicGain = c.createGain(); A.musicGain.gain.value=0.028; A.musicGain.connect(c.destination);
  const scale=[261.6,293.7,329.6,392,440, 523.3];
  let step=0;
  const iv=setInterval(()=>{
    if(!A.on){ return; }
    const n=scale[Math.floor(Math.random()*scale.length)]*(Math.random()<0.3?2:1);
    const o=c.createOscillator(), g=c.createGain();
    o.type='sine'; o.frequency.value=n;
    g.gain.setValueAtTime(0.0001,c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.5,c.currentTime+0.4);
    g.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+2.2);
    o.connect(g).connect(A.musicGain); o.start(); o.stop(c.currentTime+2.4);
    if(step%4===0){ const o2=c.createOscillator(), g2=c.createGain();
      o2.type='triangle'; o2.frequency.value=scale[0]/2;
      g2.gain.setValueAtTime(0.25,c.currentTime); g2.gain.exponentialRampToValueAtTime(0.0001,c.currentTime+1.6);
      o2.connect(g2).connect(A.musicGain); o2.start(); o2.stop(c.currentTime+1.8); }
    step++;
  }, 900);
  A.musicNodes.push(iv);
};
GAME.stopMusic = function(){ A.musicNodes.forEach(i=>clearInterval(i)); A.musicNodes=[]; };
GAME.setSound = function(on){ A.on=on; if(!on) GAME.stopMusic(); };

/* preferensi audio tersimpan lintas sesi (menu utama & dalam game) */
const AUDIOKEY='poe_audio_v1';
GAME.audioPrefs = (function(){
  try{ return Object.assign({sound:true, music:false}, JSON.parse(localStorage.getItem(AUDIOKEY))||{}); }
  catch(e){ return {sound:true, music:false}; }
})();
GAME.saveAudioPrefs = function(){
  try{ localStorage.setItem(AUDIOKEY, JSON.stringify(GAME.audioPrefs)); }catch(e){}
};
