/* ============================================================
   STATE — kondisi permainan, penyimpanan lokal
   ============================================================ */
window.GAME = window.GAME || {};
const C = GAME.CONST;

GAME.newState = function(mode, challengeId){
  const S = {
    mode,                       // story | free | challenge
    challenge: challengeId||null,
    chapter: mode==='story' ? 1 : 0,
    chapterPhase: 'playing',    // playing | complete
    month:1, year:1,
    clock: 7,                        // jam harian visual (0-24) — rutinitas warga & lampu
    treasury: mode==='free' ? 500e9 : 100e9,
    taxRate: 0.10,
    subs: { pertanian:false, pangan:false },
    grid: [],
    goods: {},
    stats: { inflasi:2.5, unemp:50, welfare:42, foodSec:60, powerOK:true },
    last: { income:10e9, expense:8e9, production:0, sales:0 },
    surplusStreak:0, deficitStreak:0,
    history: [],
    unlocked: [],
    achievements: {},
    challengeDone:false, challengeWon:false, challengePeriods:0,
    flags: { sawBudget:false, foodCrisisSeen:false, storyDone:false, quizDone:{}, introSeen:{} },
    mod: { farm:1, trade:1, ops:1, timer:{farm:0,trade:0,ops:0} },
    events: [],
    settings: { sound: GAME.audioPrefs?!!GAME.audioPrefs.sound:true, music: GAME.audioPrefs?!!GAME.audioPrefs.music:false },
    builtCount: 0,
  };
  for(const [k,g] of Object.entries(GAME.GOODS))
    S.goods[k] = { price:g.base, stock: {beras:100, sayur:60, daging:30, produk:40}[k] };
  // grid
  for(let i=0;i<C.GRID_W*C.GRID_H;i++) S.grid.push({ terrain:'grass', road:false, b:null });
  const water = [[1,10],[1,11],[2,10],[2,11],[2,12],[3,11],[3,12],[0,11],[0,12]];
  water.forEach(([x,y])=> S.grid[y*C.GRID_W+x].terrain='water');
  const put=(x,y,id,lv)=>{ const cell=S.grid[y*C.GRID_W+x]; cell.b={id, level:lv||1, born:Date.now()}; };
  put(6,5,'kantor'); put(4,6,'rumah'); put(8,6,'rumah'); put(5,8,'rumah');
  [[6,6],[6,7],[7,7],[5,7],[6,8],[7,8],[7,6],[5,6]].forEach(([x,y])=> S.grid[y*C.GRID_W+x].road=true);
  if(mode==='free'){ S.unlocked = GAME.BUILDINGS.filter(b=>!b.locked).map(b=>b.id); }
  else if(mode==='challenge'){
    S.unlocked = ['pasar','pertanian','perkebunan','gudang','pabrik','pembangkit','sekolah','taman','jalan','rumah','toko','puskesmas','rumah_sakit','peternakan','balai'];
    const ch = GAME.CHALLENGES.find(c=>c.id===challengeId);
    if(ch && ch.setup==='foodCrisis'){ S.goods.beras.stock=20; S.goods.beras.price=17000; S.mod.farm=0.6; S.mod.timer.farm=4; }
    if(ch && ch.setup==='jobCrisis'){ put(3,4,'rumah'); put(9,4,'rumah'); put(4,9,'rumah'); put(9,8,'rumah'); }
    if(ch && ch.setup==='poorStart'){ S.treasury=20e9; S.mod.ops=1.25; S.mod.timer.ops=99; }
  }
  return S;
};

/* helper pada instance state */
GAME.attachHelpers = function(S){
  if(S.clock===undefined || typeof S.clock!=='number' || isNaN(S.clock)) S.clock=7;
  S.flags = S.flags || {};
  if(!S.flags.introSeen){
    // save lama belum punya penanda ini: anggap intro bab yang sudah dijalani
    // pernah tampil agar skenario tidak diterapkan ulang saat dimuat
    const seen = {};
    const upto = S.mode==='story' ? S.chapter : 0;
    for(let i=1;i<=Math.min(7,upto);i++) seen[i]=true;
    S.flags.introSeen = seen;
  }
  if(S.challengeDone===undefined) S.challengeDone = false;
  if(S.challengeWon===undefined) S.challengeWon = false;
  if(!S.challengePeriods) S.challengePeriods = 0;
  S.cell = (x,y)=> (x<0||y<0||x>=C.GRID_W||y>=C.GRID_H) ? null : S.grid[y*C.GRID_W+x];
  S.count = id => id==='jalan' ? S.roads() : S.grid.reduce((n,c)=> n + (c.b && c.b.id===id ? 1:0), 0);
  S.totalBuildings = () => S.grid.reduce((n,c)=> n + (c.b?1:0), 0);
  S.roads = () => S.grid.reduce((n,c)=> n + (c.road?1:0), 0);
  S.isUnlocked = id => { const b=GAME.BUILDById[id]; if(b.locked) return false;
    if(S.mode==='story') return !b.unlockCh || b.unlockCh <= S.chapter || S.unlocked.includes(id);
    return S.unlocked.includes(id); };
  S.population = () => { let p=0; S.grid.forEach(c=>{ if(!c.b || c.b.done===false) return;
    const def=GAME.BUILDById[c.b.id]; if(def && def.popPerLevel) p += def.popPerLevel*c.b.level; }); return p + S.popBonus; };
  S.popBonus = S.mode==='challenge' && S.challenge==='jobCrisis' ? 1500 : 400;
  return S;
};

/* ---------- SAVE / LOAD ---------- */
const SAVEKEY='poe_save_v1';
GAME.save = function(S){
  try{
    const o = JSON.parse(JSON.stringify(S));
    delete o.cell; delete o.count; delete o.totalBuildings; delete o.roads; delete o.isUnlocked; delete o.population; delete o.popBonus;
    localStorage.setItem(SAVEKEY, JSON.stringify(o));
    return true;
  }catch(e){ console.warn('save gagal',e); return false; }
};
GAME.load = function(){
  try{
    const raw = localStorage.getItem(SAVEKEY); if(!raw) return null;
    return GAME.attachHelpers(JSON.parse(raw));
  }catch(e){ return null; }
};
GAME.hasSave = ()=>{ try{ return !!localStorage.getItem(SAVEKEY); }catch(e){ return false; } };
GAME.clearSave = ()=>{ try{ localStorage.removeItem(SAVEKEY); }catch(e){} };

/* ---------- REKOR CHALLENGE (peringkat tersimpan) ---------- */
const RANKKEY='poe_ratings_v1';
GAME.ratings = function(){
  try{ const o=JSON.parse(localStorage.getItem(RANKKEY)); return o&&typeof o==='object'?o:{}; }
  catch(e){ return {}; }
};
GAME.bestFor = function(id){ return GAME.ratings()[id] || null; };
GAME.recordRating = function(id, rank, periods){
  try{
    const all=GAME.ratings(), cur=all[id];
    const val=(GAME.RANKS[rank]||GAME.RANKS.perunggu).val;
    const curVal=cur?((GAME.RANKS[cur.rank]||GAME.RANKS.perunggu).val):0;
    if(!cur || val>curVal || (val===curVal && periods<cur.periods)){
      all[id]={ rank, periods };
      localStorage.setItem(RANKKEY, JSON.stringify(all));
      return true;
    }
  }catch(e){}
  return false;
};
