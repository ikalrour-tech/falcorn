/* ============================================================
   CITYLIFE — kota hidup: jam hari tunggal, warga berjalan,
   rutinitas pagi/siang/sore/malam, kendaraan, konstruksi
   bertahap, kebutuhan agregat & keluhan warga.
   Seluruh simulasi berjalan dari SATU accumulator dt di
   main.js (GAME.City.update) dan berhenti saat dijeda.
   ============================================================ */
window.GAME = window.GAME || {};

const CL = GAME.City = {
  speed:1, paused:false,
  t:0,            // waktu simulasi terakumulasi (detik) — utk animasi
  ph:null,        // fase hari saat ini
  npcs:[], vehs:[], boats:[], spots:[],
  _ents:[], _cw:[], _prev:null, _q:null,
  _gk:'', _needAcc:0, _harv:0, agg:null,
};

const CL_MAXNPC = 26, CL_MAXVEH = 7;
const CL_HRS_PER_SEC = 24/60;           // 1 hari simulasi = 60 detik nyata pada 1x
const CL_WALK = 1.5, CL_DRIVE = 3.0;    // tile per detik (skala waktu simulasi)

const CL_ROLE = { pertanian:'Petani', perkebunan:'Buruh Perkebunan', peternakan:'Peternak',
  pertambangan:'Penambang', pabrik:'Buruh Pabrik', pasar:'Pedagang', toko:'Penjaga Toko',
  pusat_perbelanjaan:'Karyawan Mal', sekolah:'Guru', puskesmas:'Perawat', rumah_sakit:'Dokter',
  pelabuhan:'Buruh Pelabuhan', gudang:'Karyawan Gudang', kantor:'PNS', balai:'PNS', bank:'Banker',
  pembangkit:'Teknisi Listrik', ipl:'Petugas Air', persampahan:'Petugas Kebersihan',
  monumen:'Petugas Monumen', bandara:'Petugas Bandara' };
const CL_OUTDOOR = { pertanian:1, perkebunan:1, peternakan:1, pertambangan:1, pelabuhan:1 };
const CL_N1 = ['Budi','Sari','Agus','Dewi','Joko','Maya','Andi','Siti','Eko','Lina','Bayu','Nia',
  'Tono','Ratu','Wawan','Sri','Yusuf','Rina','Slamet','Wati','Hendra','Putri','Arif','Zulfa',
  'Kartika','Danur','Marni','Sobir','Eni','Tarno','Giman','Nani','Roeli','Upik','Darto','Lasmi'];
const CL_N2 = ['Wijaya','Pratama','Santoso','Halim','Perkasa','Melati','Lesmana','Nugroho','Kusuma','Setiawan'];

/* ---------- fase hari ---------- */
function cl_phase(h){ return (h>=5&&h<8)?'pagi' : (h>=8&&h<15)?'siang' : (h>=15&&h<18)?'sore' : 'malam'; }
CL.phase = cl_phase;
CL.darkness = function(h){
  if(h>=7 && h<=17) return 0;
  if(h<5 || h>=21) return 0.45;
  if(h<7) return 0.45*(1-(h-5)/2);
  return 0.45*Math.min(1,(h-17)/2.5);   // 17..~19.5 → 0..0.45 lalu plafon sampai 21
};
CL.timeTxt = function(S){ const h=S.clock, m=Math.floor((h%1)*60);
  return `${String(Math.floor(h)).padStart(2,'0')}:${String(m).padStart(2,'0')} · ${cl_phase(h)[0].toUpperCase()+cl_phase(h).slice(1)}`; };

/* ---------- graf jalan & BFS (sekali per perjalanan) ---------- */
function cl_isRoad(S,x,y){ const GW=GAME.CONST.GRID_W, GH=GAME.CONST.GRID_H;
  return x>=0&&y>=0&&x<GW&&y<GH&&S.grid[y*GW+x].road; }
function cl_bfs(S,sx,sy,tx,ty){
  if(!cl_isRoad(S,sx,sy)||!cl_isRoad(S,tx,ty)) return null;
  if(sx===tx&&sy===ty) return [[sx,sy]];
  const GW=GAME.CONST.GRID_W, N=GW*GAME.CONST.GRID_H, goal=ty*GW+tx;
  if(!CL._prev||CL._prev.length!==N){ CL._prev=new Int32Array(N); CL._q=new Int32Array(N); }
  const prev=CL._prev, q=CL._q; prev.fill(-2);
  prev[sy*GW+sx]=-1; let qh=0,qe=0; q[qe++]=sy*GW+sx;
  while(qh<qe){ const cur=q[qh++], cx=cur%GW, cy=(cur-cx)/GW;
    const nb=[[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]];
    for(const [nx,ny] of nb){ if(!cl_isRoad(S,nx,ny)) continue; const ni=ny*GW+nx;
      if(prev[ni]!==-2) continue; prev[ni]=cur;
      if(ni===goal){ const path=[]; let c2=ni;
        while(c2!==-1){ const px=c2%GW; path.push([px,(c2-px)/GW]); c2=prev[c2]; }
        return path.reverse(); }
      q[qe++]=ni; } }
  return null;
}
function cl_door(S,gx,gy){ // tile jalan terdekat di sekeliling bangunan
  const t=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(const [dx,dy] of t) if(cl_isRoad(S,gx+dx,gy+dy)) return [gx+dx,gy+dy];
  return null; }

/* ---------- sprite warga & kendaraan (canvas kecil, di-cache) ---------- */
const CL_PAL=[ ['#e63946','#1d3557','#f1c27d','#2b2b2b'], ['#2a9d8f','#333d4b','#e8b98a','#111'],
  ['#f4a261','#1d3557','#c68642','#2b2b2b'], ['#9b5de5','#22223c','#f1c27d','#4a2c17'],
  ['#43aa55','#3a3a3a','#e8b98a','#111'], ['#e9c46a','#1d3557','#c68642','#2b2b2b'],
  ['#3a86ff','#264653','#f1c27d','#333'], ['#ef476f','#1d3557','#e8b98a','#5a3825'] ];
function cl_mk(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }
function cl_npcCanvas(pal, fr, hat, white){
  const key='NPC'+pal+fr+hat+(white?1:0);
  if(GAME.spriteCache[key]) return GAME.spriteCache[key];
  const [shirt,pants,skin,hair]=CL_PAL[pal%CL_PAL.length];
  const c=cl_mk(22,30), x=c.getContext('2d'); const O='#2a3441';
  x.lineJoin='round';
  x.fillStyle='rgba(30,50,30,.16)'; x.beginPath(); x.ellipse(11,28.5,6,2,0,0,7); x.fill();
  // kaki: fr 0/1 melangkah, 2 berdiri, 3 duduk
  x.strokeStyle=pants; x.lineWidth=2.6; x.lineCap='round';
  if(fr===3){ x.beginPath(); x.moveTo(9,22); x.lineTo(6,26); x.moveTo(13,22); x.lineTo(10,26); x.stroke(); }
  else if(fr===2){ x.beginPath(); x.moveTo(9,19); x.lineTo(8,27); x.moveTo(13,19); x.lineTo(14,27); x.stroke(); }
  else { const o=fr?1:-1; x.beginPath(); x.moveTo(9,19); x.lineTo(9-2*o,27); x.moveTo(13,19); x.lineTo(13+2*o,27); x.stroke(); }
  // badan
  x.fillStyle=white?'#f6f6f6':shirt; x.strokeStyle=O; x.lineWidth=1.3;
  x.fillRect(7,11,8,9); x.strokeRect(7,11,8,9);
  if(white){ x.fillStyle='#e63946'; x.fillRect(10.2,13.4,1.8,5); x.fillRect(8.5,15,5,1.8); }
  // lengan
  x.strokeStyle=skin; x.lineWidth=2;
  if(fr===0||fr===1){ const o=fr?2:-2; x.beginPath(); x.moveTo(7.5,12.5); x.lineTo(5.5,17+o*0.6); x.moveTo(14.5,12.5); x.lineTo(16.5,17-o*0.6); x.stroke(); }
  else if(fr===3){ x.beginPath(); x.moveTo(7.5,13); x.lineTo(6,17); x.moveTo(14.5,13); x.lineTo(16,17); x.stroke(); }
  else { x.beginPath(); x.moveTo(7.5,12.5); x.lineTo(6,18); x.moveTo(14.5,12.5); x.lineTo(16,18); x.stroke(); }
  // kepala
  x.fillStyle=skin; x.beginPath(); x.arc(11,7.5,4.2,0,7); x.fill(); x.strokeStyle=O; x.lineWidth=1.2; x.stroke();
  x.fillStyle=hair; x.beginPath(); x.arc(11,6.4,4.2,Math.PI,0); x.fill();
  if(hat===1){ x.fillStyle='#c9a227'; x.strokeStyle=O; x.lineWidth=1.2; // caping petani
    x.beginPath(); x.ellipse(11,5,7.5,2.2,0,0,7); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(11,3.6,3.4,2.2,0,Math.PI,0); x.fill(); x.stroke(); }
  if(hat===2){ x.fillStyle='#e63946'; x.strokeStyle=O; x.fillRect(7.4,2.6,7.2,2.6); x.strokeRect(7.4,2.6,7.2,2.6); } // topi siswa
  return GAME.spriteCache[key]=c;
}
function cl_vehCanvas(kind){
  const key='VEH'+kind; if(GAME.spriteCache[key]) return GAME.spriteCache[key];
  const O='#2a3441'; let c,x;
  if(kind==='truk'){ c=cl_mk(46,30); x=c.getContext('2d');
    x.lineJoin='round'; x.lineWidth=1.6; x.strokeStyle=O;
    x.fillStyle='#2a9d8f'; x.fillRect(3,6,26,14); x.strokeRect(3,6,26,14);
    x.fillStyle='#e8e2cf'; x.fillRect(6,9,20,4); x.strokeRect(6,9,20,4);
    x.fillStyle='#f4a261'; x.fillRect(30,10,12,10); x.strokeRect(30,10,12,10);
    x.fillStyle='#bfe3f5'; x.fillRect(36,12,4,4); x.strokeRect(36,12,4,4);
    x.fillStyle='#222'; x.beginPath(); x.arc(11,23,3.6,0,7); x.fill(); x.beginPath(); x.arc(36,23,3.6,0,7); x.fill(); }
  else if(kind==='mobil'){ c=cl_mk(34,20); x=c.getContext('2d');
    x.lineJoin='round'; x.lineWidth=1.5; x.strokeStyle=O;
    x.fillStyle='#e63946'; x.beginPath(); x.moveTo(3,13); x.lineTo(5,8); x.lineTo(11,8); x.lineTo(14,4); x.lineTo(22,4); x.lineTo(26,8); x.lineTo(30,9); x.lineTo(30,13); x.closePath(); x.fill(); x.stroke();
    x.fillStyle='#bfe3f5'; x.fillRect(15,5.5,6,3); x.fillRect(8,8.5,5,2.5);
    x.fillStyle='#222'; x.beginPath(); x.arc(10,14,3.2,0,7); x.fill(); x.beginPath(); x.arc(25,14,3.2,0,7); x.fill(); }
  else if(kind==='ambulans'){ c=cl_mk(44,26); x=c.getContext('2d');
    x.lineJoin='round'; x.lineWidth=1.6; x.strokeStyle=O;
    x.fillStyle='#f6f6f6'; x.fillRect(3,5,26,13); x.strokeRect(3,5,26,13);
    x.fillStyle='#e63946'; x.fillRect(14,8,4,8); x.fillRect(11,10.5,10,3);
    x.fillStyle='#cfd5dd'; x.fillRect(30,9,11,9); x.strokeRect(30,9,11,9);
    x.fillStyle='#bfe3f5'; x.fillRect(35,11,4,4);
    x.fillStyle='#222'; x.beginPath(); x.arc(11,20,3.4,0,7); x.fill(); x.beginPath(); x.arc(35,20,3.4,0,7); x.fill(); }
  else { c=cl_mk(48,26); x=c.getContext('2d'); // kapal
    x.lineJoin='round'; x.lineWidth=1.6; x.strokeStyle='#2b4a63';
    x.fillStyle='#8a5a2b'; x.beginPath(); x.moveTo(4,16); x.lineTo(44,16); x.lineTo(38,23); x.lineTo(10,23); x.closePath(); x.fill(); x.stroke();
    x.fillStyle='#f6f1e0'; x.fillRect(14,7,16,9); x.strokeRect(14,7,16,9);
    x.fillStyle='#e63946'; x.fillRect(18,9,4,3); x.fillRect(24,9,4,3);
    x.strokeStyle='#2b4a63'; x.beginPath(); x.moveTo(34,7); x.lineTo(34,16); x.stroke(); }
  return GAME.spriteCache[key]=c;
}

/* ---------- penugasan warga & kendaraan ---------- */
CL.assign = function(S){
  const GW=GAME.CONST.GRID_W;
  const homes=[], jobs=[]; let market=null, park=null, school=null, port=null, office=null;
  S.grid.forEach((c,i)=>{ if(!c.b) return; const gx=i%GW, gy=(i-gx)/GW, id=c.b.id, fin=c.b.done!==false;
    if(id==='kantor'){ office=[gx,gy]; }
    if(id==='rumah'||id==='apartemen'){ homes.push([gx,gy]); }
    if(id==='taman'){ park=[gx,gy]; }
    if(id==='sekolah'){ school=[gx,gy]; }
    if(id==='pelabuhan'){ port=[gx,gy]; }
    if(id==='pasar'||id==='toko'||id==='pusat_perbelanjaan'){ if(!market) market=[gx,gy]; }
    if(!fin) return;
    const def=GAME.BUILDById[id];
    if(def&&def.jobs) for(let k=0;k<Math.min(3,Math.max(1,def.jobs>=200?2:1));k++) jobs.push({pos:[gx,gy],id});
  });
  CL.office=office; CL.port=pos_or_null(port);
  let beds=0; S.grid.forEach(c=>{ if(!c.b||c.b.done===false) return; const def=GAME.BUILDById[c.b.id]; if(def&&def.popPerLevel) beds+=def.popPerLevel*c.b.level; });
  const pop=beds+(S.popBonus||0);
  const nAct=Math.max(6, Math.min(CL_MAXNPC, Math.round(4+pop/160)));
  for(let i=0;i<CL_MAXNPC;i++){
    const n=CL.npcs[i]||(CL.npcs[i]={i:i,on:false});
    const wasOn=n.on; n.on=i<nAct;
    if(!n.on) continue;
    if(!n.name) n.name=CL_N1[(i*7+3)%CL_N1.length]+' '+CL_N2[(i*5+1)%CL_N2.length];
    n.home= homes.length? homes[i%homes.length] : office;
    const jr= (i%5===4) ? null : (jobs.length? jobs[i%jobs.length] : null);
    n.job= jr? jr.pos : null; n.jobId= jr? jr.id : null;
    n.outdoor= !!(jr && CL_OUTDOOR[jr.id]);
    if(school && i%7===6){ n.job=school; n.jobId='sekolah'; n.outdoor=false; }
    n.role= n.jobId ? (n.jobId==='sekolah'&&i%7===6?'Siswa':(CL_ROLE[n.jobId]||'Karyawan'))
                    : (i%2? 'Ibu Rumah Tangga':'Mencari Kerja');
    n.shop= !n.job && !!market; n.market=market; n.park=park;
    n.parkLove= i%4===2;
    n.hat= n.outdoor?1 : (n.jobId==='sekolah'&&i%7===6)?2 : 0;
    n.white= n.jobId==='puskesmas'||n.jobId==='rumah_sakit';
    n.pal= i; n.small= n.jobId==='sekolah'&&i%7===6;
    if(!wasOn){ n.loc='home'; n.state='inside'; n.queued=false; n.path=null; n.pi=0; n.dir=1; n.wt=2; n.delay=0;
      const d=n.home&&cl_door(S,n.home[0],n.home[1]); if(d){ n.x=d[0]; n.y=d[1]; }
      else { const anyd=CL.anyRoad(S); if(anyd){ n.x=anyd[0]; n.y=anyd[1]; } } }
    if(n.x===undefined){ n.x=0; n.y=0; }
  }
  CL.assignVeh(S,homes,market,office,jobs);
};
function pos_or_null(v){ return v||null; }
CL.anyRoad=function(S){ const GW=GAME.CONST.GRID_W; for(let i=0;i<S.grid.length;i++) if(S.grid[i].road) return [i%GW,(i-i%GW)/GW]; return null; };

CL.assignVeh = function(S,homes,market,office,jobs){
  const GW=GAME.CONST.GRID_W;
  const byId=id=>{ let r=null; S.grid.forEach((c,i)=>{ if(!c.b||c.b.id!==id||c.b.done===false) return; const gx=i%GW; r=[gx,(i-gx)/GW]; }); return r; };
  const farms=[]; S.grid.forEach((c,i)=>{ if(c.b&&(c.b.id==='pertanian'||c.b.id==='perkebunan')&&c.b.done!==false){ const gx=i%GW; farms.push([gx,(i-gx)/GW]); } });
  const gud=byId('gudang'), pab=byId('pabrik'), rs=byId('rumah_sakit')||byId('puskesmas');
  const want=[];
  for(let f=0; f<Math.min(3,farms.length); f++){ const hops=[cl_door(S,farms[f][0],farms[f][1])];
    const g=gud||byId('gudang'); if(g) hops.push(cl_door(S,g[0],g[1]));
    if(market) hops.push(cl_door(S,market[0],market[1]));
    if(pab&&f===0) hops.push(cl_door(S,pab[0],pab[1]));
    want.push({kind:'truk', hops:hops.filter(Boolean)}); }
  if(rs&&office) want.push({kind:'ambulans', hops:[cl_door(S,rs[0],rs[1]),cl_door(S,office[0],office[1])].filter(Boolean)});
  if(homes.length>1&&market){ want.push({kind:'mobil', hops:[cl_door(S,homes[0][0],homes[0][1]),cl_door(S,market[0],market[1])].filter(Boolean)});
    want.push({kind:'mobil', hops:[cl_door(S,homes[1][0],homes[1][1]),cl_door(S,office[0],office[1])].filter(Boolean)}); }
  for(let i=0;i<CL_MAXVEH;i++){
    const v=CL.vehs[i]||(CL.vehs[i]={i:i,on:false});
    const w=i<want.length? want[i]:null;
    const on= !!(w && w.hops.length>=2);
    const sig= w? w.kind+w.hops.map(h=>h[0]+','+h[1]).join(';') : '';
    v.on=on; v.kind= w? w.kind:'';
    if(on && (v.sig!==sig || !v.hops)){ v.sig=sig; v.hops=w.hops; v.hi=0;
      v.x=v.hops[0][0]; v.y=v.hops[0][1]; v.dir=1; v.state='idle'; v.wt=(i*1.3)%2; v.path=null; v.pi=0; }
  }
  // kapal di pelabuhan
  const b=CL.boats[0]||(CL.boats[0]={on:false});
  b.on=false;
  if(CL.port){ const a=CL.port[0], bb=CL.port[1]; const waters=[];
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]]){
      const x=a+dx,y=bb+dy; const GW2=GAME.CONST.GRID_W,GH=GAME.CONST.GRID_H;
      const wc=(x>=0&&y>=0&&x<GW2&&y<GH)?S.grid[y*GW2+x]:null;
      if(wc&&wc.terrain==='water'&&!wc.b) waters.push([x,y]); }
    if(waters.length>=2){ b.on=true; b.a=waters[0]; b.b2=waters[waters.length-1]; b.x=b.a[0]; b.y=b.a[1]; } }
};

/* ---------- rutinitas: perintah per fase ---------- */
CL.replan = function(S){
  CL.assign(S);
  const ph=CL.ph;
  for(const n of CL.npcs){ if(!n.on||n.state==='walk') continue;
    if(ph==='pagi'){
      if(n.loc==='home'&&(n.job||n.shop)){ n.want=n.job?'job':'market'; n.queued=true; n.delay=0.4+(n.i%9)*0.8; }
    } else if(ph==='siang'){
      if(n.loc==='home'&&n.shop){ n.want='market'; n.queued=true; n.delay=1+(n.i%4); }
      else if(n.loc==='home'&&!n.job){ // pengangguran/IRT: ke taman atau jalan-jalan
        if(n.park&&n.parkLove){ n.want='park'; n.queued=true; n.delay=2+(n.i%3); }
        else if(n.i%2===0){ n.state='wander'; n.wt=1+(n.i%3); } }
      else if(n.loc==='job'&&n.state==='inside'&&n.i%3===0){ // pekerja istirahat keluar
        n.state='wander'; n.wt=1+(n.i%4); }
    } else if(ph==='sore'){
      if(n.loc==='job'||n.loc==='market'){
        if(n.parkLove&&n.park){ n.want='park'; } else { n.want='home'; }
        n.queued=true; n.delay=(n.i*1.7)%3; }
    } else { // malam — semua pulang & berhenti
      if(n.loc!=='home'){ n.want='home'; n.queued=true; n.delay=0; }
      else { n.state='inside'; }
    }
  }
};

CL.startTrip = function(S,n){
  const tgt = n.want==='job'? n.job : n.want==='market'? n.market : n.want==='park'? n.park : n.home;
  if(!tgt){ n.queued=false; return; }
  const d=cl_door(S,tgt[0],tgt[1]);
  if(!d){ n.queued=false; n.state='idle'; return; }
  const p=cl_bfs(S,Math.round(n.x),Math.round(n.y),d[0],d[1]);
  n.queued=false;
  if(!p){ n.state= n.loc==='home'?'inside':'idle'; return; }
  n.path=p; n.pi=0; n.hop=false; n.state='walk';
};

CL.arrive = function(S,n){
  n.state='idle'; n.wt=2+(n.i%4);
  if(n.hop){ n.hop=false; return; }             // selesai lompat kecil
  const w=n.want;
  if(w==='home'){ n.loc='home'; n.state='inside'; }
  else if(w==='job'){ n.loc='job'; n.state= n.outdoor?'wander':'inside'; if(n.jobId==='pasar') n.state='wander'; }
  else if(w==='market'){ n.loc='market'; n.state='wander'; }
  else if(w==='park'){ n.loc='park'; n.state='sit'; n.wt=6+(n.i%5)*2; }
};

/* ---------- update satu sistem waktu ---------- */
CL.update = function(S, dt){
  if(CL.paused || !S || GAME.Story && GAME.Story.frozen) return;
  const sdt=Math.min(dt,0.05)*CL.speed;
  CL.t+=sdt;
  S.clock=(S.clock + sdt*CL_HRS_PER_SEC)%24;
  const ph=cl_phase(S.clock);
  if(ph!==CL.ph){ CL.ph=ph; CL.replan(S); }
  CL._needAcc-=sdt; if(CL._needAcc<=0){ CL._needAcc=2.5; CL.periodic(S); }

  // konstruksi bertahap (jam simulasi, bebas frame-rate)
  for(let i=0;i<S.grid.length;i++){ const b=S.grid[i].b;
    if(b&&b.done===false){ b.cT+=sdt*CL_HRS_PER_SEC;
      if(b.cT>=b.cDur){ b.done=true; b.born=Date.now(); const GW=GAME.CONST.GRID_W;
        const gx=i%GW,gy=(i-gx)/GW; GAME.SFX.build(); GAME.floatText(gx,gy,'✅ Aktif!','#43aa55');
        CL.spots=null; } } }

  // warga
  for(const n of CL.npcs){ if(!n.on) continue;
    if(n.queued){ n.delay-=sdt; if(n.delay<=0) CL.startTrip(S,n); continue; }
    if(n.state==='walk'&&n.path){ cl_move(n, CL_WALK*sdt, S); if(!n.path) CL.arrive(S,n); }
    else if(n.state==='wander'){ n.wt-=sdt; if(n.wt<=0){ cl_hop(S,n); } }
    else if(n.state==='idle'){ n.wt-=sdt; if(n.wt<=0){ const lunch = CL.ph==='siang'&&n.loc==='job'&&(n.i%3===0);
      n.state= ((n.loc==='job'&&n.outdoor)||n.loc==='market'||lunch)?'wander':'idle'; n.wt=3+(n.i%3); if(n.state==='wander') cl_hop(S,n); } }
    else if(n.state==='sit'){ n.wt-=sdt; if(n.wt<=0){ n.state='wander'; n.wt=2; } }
  }
  // kendaraan
  for(const v of CL.vehs){ if(!v.on) continue;
    if(v.state==='walk'&&v.path){ cl_move(v, CL_DRIVE*sdt, S); if(!v.path){ v.state='idle'; v.wt=2+((v.i*7)%4); cl_onArriveVeh(S,v); } }
    else { v.wt-=sdt; if(v.wt<=0) cl_nextHopVeh(S,v); }
  }
  for(const b of CL.boats){ if(!b.on) continue;
    const k=(Math.sin(CL.t*0.35)+1)/2; b.x=b.a[0]+(b.b2[0]-b.a[0])*k; b.y=b.a[1]+(b.b2[1]-b.a[1])*k; }
};
function cl_onArriveVeh(S,v){ if(v.kind==='truk'&&v.hi===v.hops.length-1) { const GW=GAME.CONST.GRID_W; GAME.floatText(v.hops[v.hi][0],v.hops[v.hi][1],'📦 Pasokan pasar',' #2a9d8f'); } }
function cl_nextHopVeh(S,v){ v.hi=(v.hi+1)%v.hops.length; const from=v.hops[v.hi], to=v.hops[(v.hi+1)%v.hops.length];
  const p=cl_bfs(S,from[0],from[1],to[0],to[1]); if(!p){ v.wt=4; return; } v.path=p; v.pi=0; v.state='walk'; }
function cl_hop(S,n){ const x=Math.round(n.x), y=Math.round(n.y);
  const nb=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>cl_isRoad(S,a,b));
  if(!nb.length){ n.state='idle'; n.wt=4; return; }
  const t=nb[(n.i+Math.floor(CL.t))%nb.length]; n.path=[t]; n.pi=0; n.hop=true; n.state='walk'; }
function cl_move(e, step, S){ // gerak sepanjang path node jalan
  while(step>0){ const [tx,ty]=e.path[e.pi]; const dx=tx-e.x, dy=ty-e.y; const d=Math.hypot(dx,dy);
    if(d>1e-4) e.dir= ((e.x+ (dx/d)) - (e.y+(dy/d)))>=((e.x)-(e.y))?1:-1;
    if(d<=step||d<1e-4){ e.x=tx; e.y=ty; step-=Math.max(d,0); e.pi++;
      if(e.pi>=e.path.length){ e.path=null; return; } }
    else { e.x+=dx/d*step; e.y+=dy/d*step; return; } }
}

/* ---------- kebutuhan agregat & keluhan ---------- */
CL.recalcNeeds = function(S){
  const D=GAME.derive(S), GW=GAME.CONST.GRID_W;
  let beds=0; S.grid.forEach(c=>{ if(!c.b||c.b.done===false) return; const def=GAME.BUILDById[c.b.id]; if(def&&def.popPerLevel) beds+=def.popPerLevel*c.b.level; });
  const clamp=v=>Math.max(0,Math.min(1,v));
  CL.agg = { pangan:S.stats.foodSec/100, kerja:1-D.unemp/100, hunian:clamp(beds/Math.max(1,D.pop)),
    pendidikan:clamp(D.eduCap/Math.max(1,D.pop)), kesehatan:clamp(D.healthCap/Math.max(1,D.pop)),
    fasilitas:clamp(D.parkAmenity*0.15+S.count('toko')*0.12) };
  const out=[];
  const beras=S.goods.beras, dem=beras.demand||30;
  if(beras.stock<Math.max(25,dem*0.6)||S.stats.foodSec<65) out.push({need:'pangan',icon:'🛒',sev:93});
  if(!D.powerOK) out.push({need:'listrik',icon:'⚡',sev:95});
  if(D.healthCap<D.pop*0.4) out.push({need:'kesehatan',icon:'➕',sev:70});
  if(D.eduCap<D.pop*0.5) out.push({need:'pendidikan',icon:'🎓',sev:55});
  if(D.unemp>15) out.push({need:'kerja',icon:'💼',sev:60});
  if(D.pop-beds>450) out.push({need:'hunian',icon:'🏠',sev:50});
  out.sort((a,b)=>b.sev-a.sev);
  const top=out.slice(0,3);
  const anchors={ pangan:['pasar','toko','pusat_perbelanjaan'], kerja:['pabrik','pasar','kantor'],
    pendidikan:['sekolah','balai'], kesehatan:['puskesmas','rumah_sakit'], listrik:['pembangkit','kantor'],
    hunian:['rumah','kantor'] };
  const posOf=ids=>{ for(const id of ids){ let r=null; S.grid.forEach((c,i)=>{ if(!r&&c.b&&c.b.id===id){ const gx=i%GW; r=[gx,(i-gx)/GW]; } }); if(r) return r; }
    return CL.office||[6,5]; };
  CL.spots = top.map(sp=>{ const p=posOf(anchors[sp.need]); sp.x=p[0]; sp.y=p[1]; return sp; });
};
function cl_needText(need,S,D){
  const beras=S.goods.beras;
  switch(need){
    case 'pangan': {
      const dem=beras.demand||30, harga=`Harga Rp${Math.round(beras.price).toLocaleString('id')}/kg.`;
      const m = beras.stock<Math.max(25,dem*0.6)
        ? `Stok beras tinggal ${Math.round(beras.stock)} unit, di bawah perkiraan kebutuhan ${Math.round(dem)} unit per periode. ${harga}`
        : `Ketahanan pangan ${Math.round(S.stats.foodSec)}% — produksi beras belum sebanding dengan ${D.pop.toLocaleString('id')} penduduk, sehingga pasokan ke pasar tidak terjamin (stok sekarang ${Math.round(beras.stock)} unit, kebutuhan ${Math.round(dem)} unit/periode). ${harga}`;
      return { t:'Keluhan Pangan 🛒', m,
      c:'Produksi pertanian belum sebanding dengan jumlah penduduk, atau distribusi terhambat (jalan sedikit, gudang penuh, listrik padam).',
      a:'Bangun/tingkatkan pertanian & perkebunan, tambah gudang, pastikan listrik cukup. Subsidi pangan menahan harga tetapi membebani kas.' }; }
    case 'listrik': return { t:'Gangguan Listrik ⚡',
      m:`Kebutuhan listrik ${D.powerDemand} MW melebihi pasokan ${D.powerSupply} MW. Pabrik dan layanan publik bekerja tidak penuh.`,
      c:'Bangunan beroperasi kekurangan daya.',
      a:'Bangun pembangkit listrik atau kurangi bangunan berdaya besar.' };
    case 'kerja': return { t:'Pengangguran Tinggi 💼',
      m:`Sekitar ${D.unemp.toFixed(1)}% angkatan kerja (${D.labor.toLocaleString('id')} orang) belum mendapat pekerjaan.`,
      c:'Lowongan dari bangunan beroperasi (pasar, pabrik, toko, layanan) belum cukup menampung warga.',
      a:'Bangun pabrik, pasar, toko, atau sekolah/puskesmas (pelayanan juga membuka lowongan).' };
    case 'pendidikan': return { t:'Akses Pendidikan Kurang 🎓',
      m:`Daya tampung sekolah ${D.eduCap} warga, padahal penduduk ${D.pop.toLocaleString('id')} jiwa.`,
      c:'Jumlah & level sekolah kurang. Anak-anak warga kesulitan bersekolah.',
      a:'Bangun sekolah baru atau tingkatkan level sekolah yang ada.' };
    case 'kesehatan': return { t:'Layanan Kesehatan Kurang ➕',
      m:`Kapasitas layanan ${D.healthCap} warga untuk ${D.pop.toLocaleString('id')} penduduk.`,
      c:'Puskesmas/rumah sakit kurang sedikit atau belum beroperasi penuh (cek listrik & konstruksi).',
      a:'Bangun puskesmas lalu rumah sakit; tingkatkan levelnya.' };
    case 'hunian': return { t:'Tempat Tinggal Kurang 🏠',
      m:`Ada warga pendatang (${Math.max(0,Math.round(D.pop-beds))} jiwa) yang belum tertampung rumah.`,
      c:'Pertumbuhan penduduk melampaui jumlah rumah.',
      a:'Bangun rumah baru atau tingkatkan level rumah.' };
  }
  return {t:'Keluhan Warga', m:'', c:'', a:''};
}
CL.showComplaint = function(sp){
  const S=GAME.ui.S; if(!S) return; const D=GAME.derive(S); const k=cl_needText(sp.need,S,D);
  GAME.SFX.open();
  GAME.showModal(k.t, `<div class="rep-sec">Masalah</div><p style="font-size:13.5px">${k.m}</p>
    <div class="rep-sec">Penyebab yang diketahui</div><p style="font-size:13.5px">${k.c}</p>
    <div class="rep-sec">Yang bisa Presiden lakukan</div><p style="font-size:13.5px">${k.a}</p>
    <button class="big-btn" onclick="GAME.closeModal()">Tutup</button>
    <button class="big-btn green" onclick="GAME.closeModal();GAME.openEconomy(GAME.ui.S)">Lihat Ekonomi</button>`);
};

/* ---------- profil warga ---------- */
CL.showProfile = function(n){
  const S=GAME.ui.S; if(!S) return; GAME.SFX.pop();
  const agg=CL.agg||{pangan:.5,kerja:.5,hunian:.5,pendidikan:.5,kesehatan:.5,fasilitas:.5};
  const rows=[['🍚 Pangan',agg.pangan],['💼 Pekerjaan',n.job?Math.min(1,agg.kerja+0.25):agg.kerja],
    ['🏠 Tempat Tinggal',agg.hunian],['🎓 Pendidikan',agg.pendidikan],['➕ Kesehatan',agg.kesehatan],
    ['🌳 Fasilitas Umum',agg.fasilitas]];
  const bar=(v,i)=>{ const jit=Math.max(0,Math.min(1, v + (((n.i*37+i*13)%21)-10)/140 ));
    const col=jit>0.7?'var(--green)':jit>0.4?'var(--gold)':'var(--red)';
    return `<div class="rep-row"><span>${rows[i][0]}</span><span style="flex:1;margin:0 8px;background:#e3e8ef;border-radius:6px;height:10px;overflow:hidden"><i style="display:block;height:100%;width:${Math.round(jit*100)}%;background:${col}"></i></span><b>${Math.round(jit*100)}%</b></div>`; };
  const workName = n.jobId? GAME.BUILDById[n.jobId].name : '—';
  const blok = 'Blok '+String.fromCharCode(65+(n.home?n.home[1]:0))+' · Lahan '+((n.home?n.home[0]:0)+1);
  GAME.showModal('👤 '+n.name+' (warga fiktif)',
    `<div class="rep-row"><span>Pekerjaan</span><b>${n.role}</b></div>
     <div class="rep-row"><span>Tempat kerja</span><b>${workName}</b></div>
     <div class="rep-row"><span>Wilayah tinggal</span><b>${blok}</b></div>
     <div class="rep-sec">Kebutuhan yang dirasakan</div>${rows.map((r,i)=>bar(r[1],i)).join('')}
     <p style="font-size:11.5px;color:#5a6675;margin-top:8px">Keluhan warga mengikuti kondisi simulasi agregat — nama &amp; profil murni fiktif.</p>
     <button class="big-btn" onclick="GAME.closeModal()">Tutup</button>`);
};

/* ---------- entitas utk painter (diurutkan kedalaman) ---------- */
CL.collect = function(S, push){
  const R=GAME.R;
  let x0=-1e9,x1=1e9,y0=-1e9,y1=1e9;
  if(R.canvas){ const W=R.canvas.clientWidth, H=R.canvas.clientHeight, z=R.cam.zoom;
    x0=R.cam.x-W/2/z-90; x1=R.cam.x+W/2/z+90; y0=R.cam.y-H/2/z-60; y1=R.cam.y+H/2/z+140; }
  const inView=(x,y)=>{ const p=GAME.tileToScreen(x,y); return p.x>=x0&&p.x<=x1&&p.y>=y0-60&&p.y<=y1+40; };
  let k=0; const get=()=>CL._ents[k]||(CL._ents[k]={d:0,kind:'',ref:null});
  for(const n of CL.npcs){ if(!n.on||n.state==='inside'||n.x===undefined) continue; if(!inView(n.x,n.y)) continue;
    const e=get(); e.d=n.x+n.y+0.001; e.kind='npc'; e.ref=n; k++; push(e); }
  for(const v of CL.vehs){ if(!v.on) continue; if(!inView(v.x,v.y)) continue;
    const e=get(); e.d=v.x+v.y+0.001; e.kind='veh'; e.ref=v; k++; push(e); }
  for(const b of CL.boats){ if(!b.on||!inView(b.x,b.y)) continue;
    const e=get(); e.d=b.x+b.y+0.0012; e.kind='boat'; e.ref=b; k++; push(e); }
  // tukang bangunan di lokasi konstruksi
  const GW=GAME.CONST.GRID_W; let cw=0;
  S.grid.forEach((c,i)=>{ if(!c.b||c.b.done!==false) return; const gx=i%GW,gy=(i-gx)/GW;
    const d=cl_door(S,gx,gy); if(!d||!inView(d[0],d[1])) return;
    for(let s=0;s<2;s++){ const e=get(); const wob=Math.sin(CL.t*2+s*2.1+gx)*0.22;
      const wx=d[0]+(s?0.28:-0.28)+wob*0.1, wy=d[1]+(s? 0.18:-0.1)-wob*0.05;
      const w=CL._cw[cw]||(CL._cw[cw]={pal:2,fr:0,i:0,state:'walk'});
      w.pal=2+(i%2); w.fr=Math.floor(CL.t*5+s)%2; w.x=wx; w.y=wy; w.i=s; w.dir=1; w.small=false; w.hat=0; w.white=false;
      e.d=wx+wy+0.002; e.kind='npc'; e.ref=w; k++; cw++; push(e); } });
  CL._cw.length=cw; CL._ents.length=k;
};
CL.paint = function(ctx, e){
  const n=e.ref;
  if(e.kind==='boat'){ const p=GAME.tileToScreen(n.x,n.y); const bob=Math.sin(CL.t*2)*3;
    ctx.drawImage(cl_vehCanvas('kapal'), p.x-24, p.y-22+bob); return; }
  if(e.kind==='veh'){ const p=GAME.tileToScreen(n.x,n.y); const spr=cl_vehCanvas(n.kind);
    ctx.save(); if(n.dir<0){ ctx.translate(p.x,0); ctx.scale(-1,1); ctx.translate(-p.x,0); }
    ctx.drawImage(spr, p.x-spr.width/2, p.y-spr.height+4); ctx.restore(); return; }
  // npc / tukang
  const fr = n.state==='walk'? Math.floor(CL.t*7+(n.i||0))%2 : n.state==='sit'? 3 : (n.fr!==undefined? n.fr:2);
  const p=GAME.tileToScreen(n.x,n.y);
  const spr=cl_npcCanvas(n.pal||0, fr, n.hat||0, n.white||false);
  ctx.save();
  if(n.small) { ctx.translate(p.x, p.y); ctx.scale(0.82,0.82); ctx.translate(-p.x,-p.y); }
  if(n.dir<0 && n.state==='walk'){ ctx.translate(p.x,0); ctx.scale(-1,1); ctx.translate(-p.x,0); }
  ctx.drawImage(spr, p.x-11, p.y-29);
  ctx.restore();
};

/* ---------- gelembung keluhan (lapisan atas) ---------- */
CL.drawTop = function(ctx,S){
  if(!CL.spots) CL.recalcNeeds(S);
  for(let i=0;i<CL.spots.length;i++){ const sp=CL.spots[i];
    const p=GAME.tileToScreen(sp.x,sp.y); const bob=Math.sin(CL.t*2.4+i*1.7)*3;
    const cx=p.x+18, cy=p.y-118+bob;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,14,0,7); ctx.fillStyle='#ffffff'; ctx.fill();
    ctx.strokeStyle='#1d3557'; ctx.lineWidth=2.4; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-5,cy+12); ctx.lineTo(cx-1,cy+19); ctx.lineTo(cx+3,cy+12); ctx.closePath();
    ctx.fillStyle='#fff'; ctx.fill(); ctx.stroke();
    ctx.font='15px "Noto Color Emoji", serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(sp.icon, cx, cy+1); ctx.restore(); }
};
CL.hitSpot = function(wx,wy){ if(!CL.spots) return null;
  for(const sp of CL.spots){ const p=GAME.tileToScreen(sp.x,sp.y);
    if(Math.hypot(wx-(p.x+18), wy-(p.y-118))<24) return sp; } return null; };
CL.hitNPC = function(wx,wy){
  for(const n of CL.npcs){ if(!n.on||n.state==='inside'||n.x===undefined) continue;
    const p=GAME.tileToScreen(n.x,n.y);
    if(Math.abs(wx-p.x)<15 && wy>p.y-32 && wy<p.y+4) return n; } return null; };

/* ---------- kontrol waktu ---------- */
CL.togglePause = function(){ CL.paused=!CL.paused;
  GAME.toast(CL.paused?'⏸ Simulasi dijeda — warga berhenti beraktivitas':'▶ Simulasi berjalan','warn',2200);
  return CL.paused; };
CL.cycleSpeed = function(){ CL.speed = CL.speed===1?2: CL.speed===2?4:1; return CL.speed; };
CL.onStateChange = function(S){
  if(S.clock===undefined) S.clock=7;
  CL.t=0; CL.ph=cl_phase(S.clock); CL.spots=null; CL.agg=null;
  for(const n of CL.npcs){ n.on=false; n.name=null; }
  CL.assign(S); CL.replan(S);
  for(const v of CL.vehs){ if(v.on){ v.state='idle'; v.wt=1; v.path=null; v.hi=0; } }
};
CL.onPeriod = function(S){ CL.recalcNeeds(S); CL.assign(S); };

CL.periodic = function(S){
  // pekerja indoor "makan siang": sesekali keluar agar jalan tetap hidup
  if(CL.ph==='siang'){ for(const n of CL.npcs){ if(n.on&&n.loc==='job'&&n.state==='inside'&&n.i%3===0){ n.state='idle'; n.wt=0.5; } } }
  // rekonstruksi graf bila jumlah jalan/bangunan berubah
  let rc=0, bc=0; for(const c of S.grid){ if(c.road)rc++; if(c.b)bc++; }
  const key=rc+'|'+bc+'|'+(S.builtCount||0);
  if(key!==CL._gk){ CL._gk=key; }
  CL.recalcNeeds(S);
  // visual panen di lahan pertanian pada siang hari
  if(CL.ph==='siang'){ CL._harv-=1; if(CL._harv<=0){ CL._harv=7;
    const GW=GAME.CONST.GRID_W; for(let i=0;i<S.grid.length;i++){ const c=S.grid[i];
      if(c.b&&(c.b.id==='pertanian')&&c.b.done!==false){ const gx=i%GW; GAME.floatText(gx,(i-gx)/GW,'🌾 Panen','#7a6a1f'); break; } } } }
};

/* ---------- pencahayaan malam pada jendela ---------- */
CL.drawLights = function(ctx,gx,gy,level,S,id){
  const a=CL.darkness(S.clock); if(a<0.12) return;
  const p=GAME.tileToScreen(gx,gy);
  const meta=GAME.svgMetaForBuilding ? GAME.svgMetaForBuilding(id) : null;
  const pts=meta && meta.lights
    ? meta.lights.map(([dx,dy])=>[p.x+dx,p.y+dy])
    : [[p.x-24,p.y-74],[p.x+6,p.y-64],[p.x+28,p.y-78]].slice(0,Math.min(3,1+level));
  const rad=meta?16:20;
  for(const [lx,ly] of pts){ const g=ctx.createRadialGradient(lx,ly,1,lx,ly,rad);
    g.addColorStop(0,'rgba(255,205,90,'+(a*1.4).toFixed(2)+')'); g.addColorStop(1,'rgba(255,205,90,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(lx,ly,rad,0,7); ctx.fill(); }
};

/* ---------- air mancur (partikel ringan) ---------- */
CL.drawAmbient = function(ctx,S,list){
  if(!list || !GAME.svgMetaForBuilding) return;
  const dark=CL.darkness(S.clock);
  const alpha=1-dark*0.55;
  for(const it of list){
    if(it.kind || !it.b || it.b.done===false) continue;
    const meta=GAME.svgMetaForBuilding(it.b.id);
    if(!meta || !meta.fountain) continue;
    const p=GAME.tileToScreen(it.gx,it.gy);
    const bx=p.x+meta.fountain[0], by=p.y+meta.fountain[1];
    ctx.save();
    ctx.globalAlpha=alpha*0.5;
    ctx.strokeStyle='#d7fbff'; ctx.lineWidth=.8;
    ctx.beginPath(); ctx.ellipse(bx,by,7,2.6,0,0,7); ctx.stroke();
    for(let i=0;i<3;i++){
      const ph=((CL.t*0.85)+(i/3)+(it.gx*0.13+it.gy*0.07))%1;
      const yy=by-Math.sin(ph*Math.PI)*12;
      const xx=bx+Math.sin(ph*Math.PI*2+i)*3;
      ctx.globalAlpha=alpha*(0.7*(1-ph));
      ctx.fillStyle='#d9fbff';
      ctx.beginPath(); ctx.arc(xx,yy,1.3,0,7); ctx.fill();
    }
    ctx.restore();
  }
};

/* ---------- lampu jalan & persimpangan ---------- */
CL.drawRoadLights = function(ctx,S){
  const a=CL.darkness(S.clock); if(a<0.12) return;
  const GW=GAME.CONST.GRID_W, GH=GAME.CONST.GRID_H;
  for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
    const i=gy*GW+gx, c=S.grid[i]; if(!c.road) continue;
    const p=GAME.tileToScreen(gx,gy);
    // kepala lampu jalan — posisinya sama dengan sprite street_lamp_01 di render.js
    if((gx*2+gy)%5===0){
      const lx=p.x-27, ly=p.y-36;
      const g=ctx.createRadialGradient(lx,ly,1,lx,ly,24);
      g.addColorStop(0,'rgba(255,226,150,'+(a*1.25).toFixed(2)+')');
      g.addColorStop(1,'rgba(255,226,150,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(lx,ly,24,0,7); ctx.fill();
    }
    let n=0;
    if(gy>0 && S.grid[i-GW].road) n++;
    if(gy<GH-1 && S.grid[i+GW].road) n++;
    if(gx>0 && S.grid[i-1].road) n++;
    if(gx<GW-1 && S.grid[i+1].road) n++;
    if(n<3) continue;
    const lx=p.x, ly=p.y-46;
    const g=ctx.createRadialGradient(lx,ly,1,lx,ly,16);
    g.addColorStop(0,'rgba(255,220,120,'+(a*0.9).toFixed(2)+')');
    g.addColorStop(1,'rgba(255,220,120,0)');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(lx,ly,16,0,7); ctx.fill();
  }
};
