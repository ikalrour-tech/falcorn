/* ============================================================
   SPRITES — gambar prosedural bergaya kartun isometrik
   (mengikuti gaya "Lembar Aset Game Ekonomi Nusantara")
   ============================================================ */
window.GAME = window.GAME || {};
const OUT = '#2a3441';

function mkCanvas(w,h){ const c=document.createElement('canvas'); c.width=w; c.height=h; return c; }

/* helper dasar */
function diamond(ctx,x,y,hw,hh){ ctx.beginPath(); ctx.moveTo(x,y-hh); ctx.lineTo(x+hw,y); ctx.lineTo(x,y+hh); ctx.lineTo(x-hw,y); ctx.closePath(); }
function faceRect(ctx, ox,oy, ux,uy, vx,vy, x0,y0,x1,y1, fill, stroke){
  ctx.beginPath();
  ctx.moveTo(ox+ux*x0+vx*y0, oy+uy*x0+vy*y0);
  ctx.lineTo(ox+ux*x1+vx*y0, oy+uy*x1+vy*y0);
  ctx.lineTo(ox+ux*x1+vx*y1, oy+uy*x1+vy*y1);
  ctx.lineTo(ox+ux*x0+vx*y1, oy+uy*x0+vy*y1);
  ctx.closePath();
  if(fill){ ctx.fillStyle=fill; ctx.fill(); }
  if(stroke){ ctx.strokeStyle=stroke; ctx.lineWidth=1.4; ctx.stroke(); }
}
/* kotak isometrik: tapak diamond (cx,cy) hw x hh, tinggi dinding h */
function isoBox(ctx,cx,cy,hw,hh,h,cTop,cL,cR){
  const N=[cx,cy-hh],E=[cx+hw,cy],S=[cx,cy+hh],W=[cx-hw,cy];
  // sisi kiri (W->S) dan kanan (S->E)
  faceRect(ctx,W[0],W[1],hw,hh,0,-h,0,0,1,1,cL,OUT);
  faceRect(ctx,S[0],S[1],hw,-hh,0,-h,0,0,1,1,cR,OUT);
  diamond(ctx,cx,cy-h,hw,hh); ctx.fillStyle=cTop; ctx.fill(); ctx.strokeStyle=OUT; ctx.lineWidth=2; ctx.stroke();
}
/* atap limas: dinding setinggi wallH, limas setinggi roofH */
function isoRoof(ctx,cx,cy,hw,hh,wallH,roofH,cA,cB){
  const top=cy-wallH;
  const E=[cx+hw,top],S=[cx,top+hh],W=[cx-hw,top];
  const apex=[cx,cy-hh-wallH-roofH*1.1];
  ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(W[0],W[1]); ctx.lineTo(S[0],S[1]); ctx.lineTo(apex[0],apex[1]); ctx.closePath();
  ctx.fillStyle=cA; ctx.fill(); ctx.strokeStyle=OUT; ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(S[0],S[1]); ctx.lineTo(E[0],E[1]); ctx.lineTo(apex[0],apex[1]); ctx.closePath();
  ctx.fillStyle=cB; ctx.fill(); ctx.strokeStyle=OUT; ctx.lineWidth=2; ctx.stroke();
  return apex;
}
function flag(ctx,x,y,col){ ctx.strokeStyle=OUT; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-16); ctx.stroke();
  ctx.fillStyle=col||'#e63946'; ctx.beginPath(); ctx.moveTo(x,y-16); ctx.lineTo(x+11,y-13); ctx.lineTo(x,y-10); ctx.closePath(); ctx.fill(); ctx.stroke(); }
function tree(ctx,x,y,s=1){ ctx.fillStyle='#7a4a21'; ctx.fillRect(x-2*s,y-8*s,4*s,8*s);
  ctx.beginPath(); ctx.arc(x,y-13*s,7*s,0,7); ctx.fillStyle='#3f9b4f'; ctx.fill(); ctx.strokeStyle=OUT; ctx.lineWidth=1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(x-4*s,y-9*s,5*s,0,7); ctx.fillStyle='#57b765'; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(x+4*s,y-10*s,5*s,0,7); ctx.fillStyle='#4daa5b'; ctx.fill(); ctx.stroke(); }
function palmTree(ctx,x,y,s=1,sway=0){
  const tx=x+sway*4*s, ty=y-24*s;
  ctx.strokeStyle=OUT; ctx.lineWidth=3.2*s; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo(x-3*s+sway*2*s,y-12*s,tx,ty); ctx.stroke();
  ctx.strokeStyle='#8a5a2b'; ctx.lineWidth=1.7*s;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo(x-3*s+sway*2*s,y-12*s,tx,ty); ctx.stroke();
  const fronds=[[-1,-.35],[-.62,-.85],[0,-1],[.68,-.82],[1,-.3]];
  for(let i=0;i<fronds.length;i++){
    const [dx,dy]=fronds[i];
    const ex=tx+dx*13*s+sway*3*s, ey=ty+dy*8*s+3*s;
    ctx.beginPath(); ctx.moveTo(tx,ty);
    ctx.quadraticCurveTo(tx+dx*8*s,ty+dy*4*s-3*s,ex,ey);
    ctx.strokeStyle=OUT; ctx.lineWidth=3.4*s; ctx.stroke();
    ctx.strokeStyle=i%2?'#57b765':'#3f9b4f'; ctx.lineWidth=1.9*s; ctx.stroke();
  }
  ctx.fillStyle='#c9a227'; ctx.strokeStyle=OUT; ctx.lineWidth=.8;
  ctx.beginPath(); ctx.arc(tx-2*s,ty+2*s,1.7*s,0,7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(tx+2.4*s,ty+1.2*s,1.5*s,0,7); ctx.fill(); ctx.stroke();
}
function stars(ctx,x,y,level){ if(level<=1)return; ctx.fillStyle='#ffd34d'; ctx.strokeStyle=OUT; ctx.lineWidth=1;
  for(let i=0;i<level-1;i++){ const sx=x+i*11-(level-2)*5; ctx.beginPath();
    for(let j=0;j<10;j++){ const r=j%2?2.2:5, a=-Math.PI/2+j*Math.PI/5; ctx.lineTo(sx+Math.cos(a)*r, y+Math.sin(a)*r); }
    ctx.closePath(); ctx.fill(); ctx.stroke(); } }
function windows(ctx,cx,cy,hw,hh,h,cols){ // jendela di kedua sisi depan
  const uL=[hw,hh], vL=[0,-h], uR=[hw,-hh], vR=[0,-h];
  const Wp=[cx-hw,cy], Sp=[cx,cy+hh];
  for(const [ox,oy,u,v] of [[Wp[0],Wp[1],uL,vL],[Sp[0],Sp[1],uR,vR]]){
    for(const [x0,x1] of [[0.15,0.33],[0.42,0.6],[0.68,0.86]])
      for(const [y0,y1] of [[0.55,0.85]])
        faceRect(ctx,ox,oy,u[0],u[1],v[0],v[1],x0,y0,x1,y1,cols||'#bfe3f5',OUT);
  }
}
function door(ctx,cx,cy,hw,hh,side){ // pintu di sisi kanan depan
  const Sp=[cx,cy+hh];
  faceRect(ctx,Sp[0],Sp[1],hw,-hh,0,-1, side||0.38,0, side?(side+0.18):0.56,0.42,'#8a5a2b',OUT);
}
function shadow(ctx,cx,cy,hw,hh){ diamond(ctx,cx,cy+6,hw*1.05,hh*1.05); ctx.fillStyle='rgba(30,50,30,.18)'; ctx.fill(); }

/* ---------- TANAH ---------- */
function drawTile(ctx, kind, variant){
  const hw=62, hh=31; ctx.translate(66, 40);
  if(kind==='water'){
    diamond(ctx,0,0,hw,hh); ctx.fillStyle='#3aa8d8'; ctx.fill(); ctx.strokeStyle='#2b7fa8'; ctx.lineWidth=2; ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=2;
    for(let i=0;i<3;i++){ ctx.beginPath(); ctx.moveTo(-24+i*18, -6+i*7); ctx.quadraticCurveTo(-16+i*18,-11+i*7,-8+i*18,-6+i*7); ctx.stroke(); }
    return;
  }
  const g = ['#8fd06a','#9ad873','#86c962','#a3dd7c'][variant%4];
  diamond(ctx,0,0,hw,hh); ctx.fillStyle=g; ctx.fill(); ctx.strokeStyle='#5ea247'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.13)';
  for(let i=0;i<5;i++){ const px=((variant*37+i*53)%84)-42, py=((variant*61+i*29)%40)-20; ctx.fillRect(px,py,3,2); }
  if(variant%8===5){
    tree(ctx, -30+(variant*13%50), 4, .75);
  }
}
function drawRoad(ctx, conns){
  const hw=57, hh=28; ctx.translate(66,40);
  const roadSvg = GAME._svg && GAME._svg.images && GAME._svg.images.road_01;
  if(roadSvg){
    // sedikit dilebihkan agar tepi petak jalan menyambung mulus dengan petak sebelah
    ctx.drawImage(roadSvg, -72, -44, 144, 88);
  } else {
    diamond(ctx,0,0,hw+3,hh+1.5); ctx.fillStyle='#565d68'; ctx.fill();
    diamond(ctx,0,0,hw,hh); ctx.fillStyle='#767d89'; ctx.fill(); ctx.strokeStyle='#4b5563'; ctx.lineWidth=1.5; ctx.stroke();
  }
  // marka dinamis mengikuti sambungan jalan
  ctx.strokeStyle='#f2f5f8'; ctx.lineWidth=2.2; ctx.setLineDash([7,7]); ctx.lineCap='round';
  const to=(tx,ty)=>{ ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(tx,ty); ctx.stroke(); };
  let any=false;
  if(conns.n){ to(0,-hh); any=true; } if(conns.s){ to(0,hh); any=true; }
  if(conns.e){ to(hw,0); any=true; } if(conns.w){ to(-hw,0); any=true; }
  if(!any){ to(-13,-6.5); to(13,6.5); }
  ctx.setLineDash([]);
  const n=(conns.n?1:0)+(conns.s?1:0)+(conns.e?1:0)+(conns.w?1:0);
  if(n>=3){
    ctx.strokeStyle=OUT; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(0,-29); ctx.lineTo(0,-46); ctx.stroke();
    ctx.strokeStyle='#5c646e'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(0,-29); ctx.lineTo(0,-46); ctx.stroke();
    ctx.fillStyle='#ffe9a1'; ctx.strokeStyle=OUT; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(-4.5,-46); ctx.lineTo(4.5,-46); ctx.lineTo(3.2,-51); ctx.lineTo(-3.2,-51); ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
}

/* ---------- BANGUNAN ---------- */
const SPR={}; // id -> fn(ctx) digambar dengan titik pusat tapak di (66,120)
SPR.kantor = c=>{ shadow(c,66,126,52,26); isoBox(c,66,120,44,22,34,'#f6f1e0','#d9cfb4','#ece4cb');
  windows(c,66,120,44,22,34,'#9fc6e8'); isoRoof(c,66,120,46,23,34,26,'#2a5d8f','#3a75ad','#2f679a'); flag(c,66,58); };
SPR.balai = c=>{ shadow(c,66,126,56,28); isoBox(c,66,120,48,24,46,'#cfd8e6','#a8b5c9','#bcc8da');
  windows(c,66,120,48,24,46,'#7fb2d9'); isoBox(c,66,74,20,10,10,'#e6ebf3','#c2ccdd','#d5dfeb'); flag(c,66,56,'#1d3557'); };
SPR.bank = c=>{ shadow(c,66,126,50,25); isoBox(c,66,120,42,21,30,'#f3e8c8','#d6c493','#e7d7a8');
  const Sp=[66,141]; for(const a of [0.2,0.45,0.7]) faceRect(c,Sp[0],Sp[1],42,-21,0,-30,a,0,a+0.12,1,'#fff',OUT);
  isoRoof(c,66,120,44,22,30,16,'#caa53d','#e0be52','#c9a53f'); flag(c,66,68); };
SPR.pasar = c=>{ shadow(c,66,126,58,29); isoBox(c,66,120,50,25,22,'#f2d8a8','#d9b97f','#e8ca93');
  door(c,66,120,50,25); // kanopi bergaris
  const base=120-22; const N=[66,base-25],E=[66+54,base],S=[66,base+27],W=[66-54,base];
  ctxC(c); c.fillStyle='#e63946'; c.beginPath(); c.moveTo(W[0],W[1]); c.lineTo(S[0],S[1]); c.lineTo(S[0],S[1]-8); c.lineTo(W[0],W[1]-8); c.closePath(); c.fill(); c.stroke();
  c.fillStyle='#f6f1e0'; c.beginPath(); c.moveTo(S[0],S[1]); c.lineTo(E[0],E[1]); c.lineTo(E[0],E[1]-8); c.lineTo(S[0],S[1]-8); c.closePath(); c.fill(); c.stroke();
  diamond(c,66,base-4,54,27); c.fillStyle='rgba(230,57,70,.85)'; c.fill(); c.stroke();
  c.fillStyle='#ffd34d'; for(let i=0;i<4;i++){ c.beginPath(); c.arc(30+i*24, 108+(i%2)*8, 4,0,7); c.fill(); c.stroke(); } };
function ctxC(c){ c.strokeStyle=OUT; c.lineWidth=2; c.lineJoin='round'; }
SPR.toko = c=>{ shadow(c,66,126,44,22); isoBox(c,66,120,36,18,24,'#dcedc8','#b5cf9a','#c8e0af');
  const Sp=[66,138]; faceRect(c,Sp[0],Sp[1],36,-18,0,-10,0.1,0.9,0.9,1.15,'#2a9d8f',OUT);
  isoBox(c,66,96,36,18,4,'#e8f5d8','#c8dcb0','#d8ecbe'); windows(c,66,120,36,18,24,'#bfe3f5'); };
SPR.pusat_perbelanjaan = c=>{ shadow(c,66,126,60,30); isoBox(c,66,120,52,26,56,'#bfe0f0','#8fbcd4','#a8d0e4');
  windows(c,66,120,52,26,56,'#5d9cc0'); isoBox(c,66,64,30,15,8,'#d8ecf6','#a8ccd9','#c4e0ec');
  const Sp=[66,146]; faceRect(c,Sp[0],Sp[1],52,-26,0,-56,0.3,0.02,0.7,0.16,'#f4a261',OUT); };
SPR.gudang = c=>{ shadow(c,66,126,54,27); isoBox(c,66,120,46,23,26,'#c9ccd2','#9aa0aa','#b4b9c1');
  const base=94; diamond(c,66,base,46,23); c.fillStyle='#dde1e6'; c.fill(); c.strokeStyle=OUT; c.lineWidth=2; c.stroke();
  const Sp=[66,143]; faceRect(c,Sp[0],Sp[1],46,-23,0,-26,0.32,0,0.68,0.75,'#7d838d',OUT);
  c.fillStyle='#f4a261'; c.font='bold 12px sans-serif'; c.fillText('GUDANG',36,84); };
SPR.pelabuhan = c=>{ shadow(c,66,126,58,29); diamond(c,66,120,56,28); c.fillStyle='#3aa8d8'; c.fill(); c.strokeStyle='#2b7fa8'; c.lineWidth=2; c.stroke();
  isoBox(c,52,112,26,13,8,'#d8b98a','#b5905e','#c8a876'); // dermaga
  c.strokeStyle=OUT; c.lineWidth=3; c.beginPath(); c.moveTo(70,118); c.lineTo(70,72); c.lineTo(104,84); c.stroke(); // crane
  c.lineWidth=2; c.beginPath(); c.moveTo(104,84); c.lineTo(104,98); c.stroke(); c.fillStyle='#e63946'; c.fillRect(99,98,10,8); c.strokeRect(99,98,10,8);
  const cols=['#e63946','#2a9d8f','#e9c46a']; cols.forEach((cl,i)=>{ c.fillStyle=cl; c.fillRect(28+i*14,106-i*3,12,8); c.strokeStyle=OUT; c.lineWidth=1.5; c.strokeRect(28+i*14,106-i*3,12,8); }); };
SPR.bandara = c=>{ shadow(c,66,126,58,29); isoBox(c,66,120,50,25,18,'#e6ebf3','#bcc8da','#d0daea');
  isoBox(c,88,96,10,5,26,'#f6f1e0','#d9cfb4','#ece4cb'); diamond(c,88,70,10,5); c.fillStyle='#2a5d8f'; c.fill(); c.strokeStyle=OUT; c.stroke();
  c.save(); c.translate(44,116); c.rotate(-.4); c.fillStyle='#f6f6f6'; c.strokeStyle=OUT; c.lineWidth=1.6;
  c.beginPath(); c.ellipse(0,0,20,5,0,0,7); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(-2,-2); c.lineTo(-10,-12); c.lineTo(-4,-2); c.fill(); c.stroke(); c.restore(); };
SPR.pertanian = c=>{ shadow(c,66,126,58,29); diamond(c,66,120,56,28); c.fillStyle='#caa53d'; c.fill(); c.strokeStyle='#9a7a24'; c.lineWidth=2; c.stroke();
  c.strokeStyle='#8a6d1a'; c.lineWidth=2.5; for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(66+i*16-8, 96+Math.abs(i)*4); c.lineTo(66+i*16+8, 130+Math.abs(i)*-2+8); c.stroke(); }
  c.fillStyle='#4daa5b'; for(let i=0;i<8;i++){ c.beginPath(); c.arc(24+i*11, 112+(i%3)*8, 3.5,0,7); c.fill(); }
  isoBox(c,88,104,14,7,12,'#e8ca93','#c8a876','#d8b98a'); isoRoof(c,88,104,14,7,12,6,'#b5482e','#c85a3a','#a84428'); };
SPR.perkebunan = c=>{ shadow(c,66,126,58,29); diamond(c,66,120,56,28); c.fillStyle='#7fb069'; c.fill(); c.strokeStyle='#54803f'; c.lineWidth=2; c.stroke();
  for(let r0=0;r0<3;r0++) for(let i=0;i<4;i++){ const x=34+i*20+r0*4, y=104+r0*12+i*2;
    c.beginPath(); c.arc(x,y,7,0,7); c.fillStyle='#3f9b4f'; c.fill(); c.strokeStyle=OUT; c.lineWidth=1.5; c.stroke();
    c.beginPath(); c.arc(x-2,y-2,3,0,7); c.fillStyle='#67c075'; c.fill(); }
  c.fillStyle='#8a5a2b'; c.fillRect(92,108,3,10); c.fillStyle='#e63946'; c.beginPath(); c.arc(93.5,105,6,0,7); c.fill(); c.strokeStyle=OUT; c.stroke(); };
SPR.pernakan = c=>{ shadow(c,66,126,58,29); diamond(c,66,120,56,28); c.fillStyle='#9ad873'; c.fill(); c.strokeStyle='#5ea247'; c.lineWidth=2; c.stroke();
  isoBox(c,84,108,18,9,16,'#c85a3a','#a84428','#b5482e'); isoRoof(c,84,108,19,9.5,16,8,'#e63946','#f0705f','#d95442');
  c.fillStyle='#f6f6f6'; c.strokeStyle=OUT; c.lineWidth=1.6; c.beginPath(); c.ellipse(46,116,11,7,0,0,7); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(56,112,5,4,0,0,7); c.fill(); c.stroke(); c.fillStyle='#333'; c.fillRect(57,110,1.6,1.6);
  c.strokeStyle='#8a5a2b'; c.lineWidth=2; c.beginPath(); c.moveTo(26,126); c.lineTo(66,136); c.moveTo(26,120); c.lineTo(66,130); c.stroke(); };
SPR.pabrik = c=>{ shadow(c,66,126,58,29); isoBox(c,66,120,48,24,32,'#b9c0c9','#8d96a2','#a3acb8');
  windows(c,66,120,48,24,32,'#7fb2d9');
  for(let i=0;i<3;i++){ const x=34+i*22; c.fillStyle='#7d838d'; c.strokeStyle=OUT; c.lineWidth=1.6;
    c.beginPath(); c.moveTo(x,96); c.lineTo(x+11,88); c.lineTo(x+11,96); c.closePath(); c.fill(); c.stroke(); }
  [[52,70],[70,64]].forEach(([x,y],i)=>{ c.fillStyle='#e0e4e9'; c.strokeStyle=OUT; c.lineWidth=2; c.fillRect(x,y-20,9,26); c.strokeRect(x,y-20,9,26);
    c.fillStyle='#e63946'; c.fillRect(x,y-20,9,5); c.strokeRect(x,y-20,9,5);
    c.fillStyle='rgba(230,230,235,.85)'; c.beginPath(); c.arc(x+4,y-26+i*3,5,0,7); c.fill(); c.beginPath(); c.arc(x+9,y-32+i*3,6,0,7); c.fill(); }); };
SPR.pertambangan = c=>{ shadow(c,66,126,58,29); diamond(c,66,120,56,28); c.fillStyle='#b5a184'; c.fill(); c.strokeStyle='#8a765a'; c.lineWidth=2; c.stroke();
  c.fillStyle='#4b5563'; c.beginPath(); c.ellipse(60,118,16,9,0,0,7); c.fill(); c.strokeStyle=OUT; c.stroke();
  c.strokeStyle='#6b7280'; c.lineWidth=4; c.beginPath(); c.moveTo(30,130); c.lineTo(86,96); c.stroke(); c.strokeStyle=OUT; c.lineWidth=1.5; c.stroke();
  c.fillStyle='#374151'; for(let i=0;i<4;i++){ c.beginPath(); c.arc(38+i*14, 126-i*7.5, 4,0,7); c.fill(); }
  c.fillStyle='#e9c46a'; c.beginPath(); c.moveTo(90,116); c.lineTo(104,124); c.lineTo(90,130); c.lineTo(78,124); c.closePath(); c.fill(); c.strokeStyle=OUT; c.stroke(); };
SPR.rumah = c=>{ shadow(c,66,126,42,21); isoBox(c,66,120,32,16,20,'#f6e7c8','#e0c998','#eedaaf');
  door(c,66,120,32,16); faceRect(c,66-32,120,32,16,0,-20,0.55,0.45,0.8,0.75,'#bfe3f5',OUT);
  isoRoof(c,66,120,34,17,20,18,'#c85a3a','#e0704f','#b5482e'); };
SPR.sekolah = c=>{ shadow(c,66,126,56,28); isoBox(c,66,120,46,23,30,'#f6d878','#d9b94e','#eacc60');
  windows(c,66,120,46,23,30,'#9fc6e8'); isoRoof(c,66,120,48,24,30,20,'#2a9d8f','#3cbdb0','#249385'); flag(c,66,60,'#1d3557');
  const Sp=[66,143]; faceRect(c,Sp[0],Sp[1],46,-23,0,-30,0.4,0,0.6,0.35,'#fff',OUT); };
SPR.puskesmas = c=>{ shadow(c,66,126,48,24); isoBox(c,66,120,40,20,26,'#f6f6f6','#d8dce2','#ebeeF2');
  const Sp=[66,140]; faceRect(c,Sp[0],Sp[1],40,-20,0,-26,0.42,0.3,0.58,0.42,'#e63946',OUT);
  faceRect(c,Sp[0],Sp[1],40,-20,0,-26,0.47,0.18,0.53,0.55,'#e63946',OUT);
  isoBox(c,66,94,40,20,5,'#3aa8d8','#2b7fa8','#359ac6'); };
SPR.rumah_sakit = c=>{ shadow(c,66,126,56,28); isoBox(c,66,120,44,22,44,'#f6f6f6','#d8dce2','#ebeeF2');
  windows(c,66,120,44,22,44,'#9fc6e8');
  const Sp=[66,142]; faceRect(c,Sp[0],Sp[1],44,-22,0,-44,0.4,0.62,0.6,0.72,'#e63946',OUT);
  faceRect(c,Sp[0],Sp[1],44,-22,0,-44,0.47,0.5,0.53,0.85,'#e63946',OUT);
  isoBox(c,66,76,20,10,6,'#3aa8d8','#2b7fa8','#359ac6'); flag(c,66,64,'#e63946'); };
SPR.pembangkit = c=>{ shadow(c,66,126,56,28); isoBox(c,66,120,46,23,22,'#cfd5dd','#a8b0bc','#bcc4cf');
  [[50,96],[74,90]].forEach(([x,y])=>{ c.fillStyle='#e6ebf3'; c.strokeStyle=OUT; c.lineWidth=2;
    c.beginPath(); c.moveTo(x-9,y+14); c.quadraticCurveTo(x-11,y-8,x-5,y-14); c.lineTo(x+5,y-14); c.quadraticCurveTo(x+11,y-8,x+9,y+14); c.closePath(); c.fill(); c.stroke();
    c.fillStyle='rgba(235,238,242,.9)'; c.beginPath(); c.arc(x,y-19,6,0,7); c.fill(); c.beginPath(); c.arc(x+5,y-26,7,0,7); c.fill(); });
  const Sp=[66,143]; faceRect(c,Sp[0],Sp[1],46,-23,0,-22,0.15,0.2,0.35,0.8,'#f4a261',OUT); };
SPR.ipl = c=>{ shadow(c,66,126,52,26); isoBox(c,66,120,42,21,16,'#c9ccd2','#9aa0aa','#b4b9c1');
  [[52,100],[78,96]].forEach(([x,y])=>{ c.fillStyle='#3aa8d8'; c.strokeStyle=OUT; c.lineWidth=2; c.beginPath(); c.ellipse(x,y,12,7,0,0,7); c.fill(); c.stroke();
    c.fillStyle='#5fc0e8'; c.beginPath(); c.ellipse(x,y-3,12,7,0,0,7); c.fill(); c.stroke(); });
  c.strokeStyle='#6b7280'; c.lineWidth=4; c.beginPath(); c.moveTo(40,118); c.lineTo(92,110); c.stroke(); };
SPR.persampahan = c=>{ shadow(c,66,126,52,26); diamond(c,66,120,50,25); c.fillStyle='#a3a3a3'; c.fill(); c.strokeStyle='#6f6f6f'; c.lineWidth=2; c.stroke();
  [[44,108,'#43aa55'],[66,100,'#2a9d8f'],[84,110,'#e9c46a']].forEach(([x,y,col])=>{ c.fillStyle=col; c.strokeStyle=OUT; c.lineWidth=2;
    c.fillRect(x-11,y-14,22,16); c.strokeRect(x-11,y-14,22,16); c.fillStyle='rgba(0,0,0,.15)'; c.fillRect(x-11,y-14,22,4); });
  c.fillStyle='#fff'; c.font='bold 10px sans-serif'; c.fillText('♻',52,118); };
SPR.taman = c=>{ shadow(c,66,126,56,28); diamond(c,66,120,54,27); c.fillStyle='#8fd06a'; c.fill(); c.strokeStyle='#5ea247'; c.lineWidth=2; c.stroke();
  c.fillStyle='#3aa8d8'; c.strokeStyle='#2b7fa8'; c.beginPath(); c.ellipse(66,120,13,7,0,0,7); c.fill(); c.stroke();
  c.fillStyle='#bfe3f5'; c.beginPath(); c.arc(66,113,3,0,7); c.fill();
  tree(c,38,116,.8); tree(c,92,112,.7); tree(c,66,98,.65); };
SPR.monumen = c=>{ shadow(c,66,126,40,20); isoBox(c,66,120,28,14,8,'#d8dce2','#b0b8c2','#c6ccd4');
  isoBox(c,66,112,8,4,8,'#e8ecf2','#c8ccd4','#dce0e6');
  c.fillStyle='#f3f4f6'; c.strokeStyle=OUT; c.lineWidth=2;
  c.beginPath(); c.moveTo(62,104); c.lineTo(66,52); c.lineTo(70,104); c.closePath(); c.fill(); c.stroke();
  c.fillStyle='#ffd34d'; c.beginPath(); c.arc(66,48,4,0,7); c.fill(); c.stroke(); };
SPR.jalan = null; // digambar sebagai tile datar

/* ---------- CACHE & API ---------- */
GAME.spriteCache = {};
GAME.getTileCanvas = function(kind, variant){
  const key='T'+kind+(kind==='road' ? (variant.n?1:0)+(variant.s?2:0)+(variant.e?4:0)+(variant.w?8:0) : variant);
  if(this.spriteCache[key]) return this.spriteCache[key];
  const c=mkCanvas(132,80), ctx=c.getContext('2d');
  if(kind==='road') drawRoad(ctx, variant); else drawTile(ctx,kind,variant);
  return this.spriteCache[key]=c;
};
GAME.getSprite = function(id, level){
  const key=id+'_'+level; if(this.spriteCache[key]) return this.spriteCache[key];
  const def=GAME.BUILDById && GAME.BUILDById[id];
  if(def && def.sprite && GAME.getSvgBuildingSprite){
    const svg=GAME.getSvgBuildingSprite(def.sprite, level);
    if(svg) return this.spriteCache[key]=svg;
  }
  const c=mkCanvas(160,170), ctx=c.getContext('2d');
  ctx.lineJoin='round';
  if(SPR[id]) SPR[id](ctx);
  if(level>1){ ctx.save(); ctx.translate(0,-6); ctx.scale(1.06,1.06); ctx.restore(); }
  stars(ctx,66,34,level);
  c.ax=66; c.ay=120; c.drawW=160; c.drawH=170;
  return this.spriteCache[key]=c;
};
GAME.drawStars = stars;
GAME.drawPalmTree = palmTree;
GAME.hasSprite = id => !!SPR[id];

/* ---------- POTRET KARAKTER ---------- */
GAME.getPortrait = function(who){
  const key='P'+who; if(this.spriteCache[key]) return this.spriteCache[key];
  const ch=GAME.CHARACTERS[who]||GAME.CHARACTERS.menteri;
  const c=mkCanvas(88,88), x=c.getContext('2d');
  x.fillStyle='#dcedc8'; x.fillRect(0,0,88,88);
  x.fillStyle='#cfe8ff'; x.beginPath(); x.arc(44,52,34,0,7); x.fill();
  // badan/baju
  x.fillStyle=ch.accent; x.beginPath(); x.moveTo(14,88); x.quadraticCurveTo(44,58,74,88); x.closePath(); x.fill();
  x.strokeStyle=OUT; x.lineWidth=2; x.stroke();
  x.fillStyle='#fff'; x.beginPath(); x.moveTo(38,68); x.lineTo(44,88); x.lineTo(50,68); x.closePath(); x.fill(); x.stroke();
  if(ch.style==='suit'){ x.fillStyle='#e63946'; x.beginPath(); x.moveTo(42,70); x.lineTo(46,70); x.lineTo(44,84); x.closePath(); x.fill(); }
  if(ch.style==='farm'){ x.fillStyle='#fff'; x.fillRect(41,72,6,10); }
  if(ch.style==='trade'){ x.fillStyle='#f4a261'; x.fillRect(30,76,28,12); x.strokeRect(30,76,28,12); }
  // kepala
  x.fillStyle=ch.skin; x.beginPath(); x.arc(44,42,17,0,7); x.fill(); x.strokeStyle=OUT; x.stroke();
  x.fillStyle=ch.hair; x.beginPath(); x.arc(44,38,17,Math.PI,0); x.fill(); x.stroke();
  x.fillStyle=OUT; x.beginPath(); x.arc(38,44,1.8,0,7); x.arc(50,44,1.8,0,7); x.fill();
  x.beginPath(); x.arc(44,50,5,0.2,Math.PI-0.2); x.stroke();
  if(ch.style==='farm'){ x.fillStyle='#c9a227'; x.beginPath(); x.ellipse(44,27,24,6,0,0,7); x.fill(); x.stroke();
    x.beginPath(); x.ellipse(44,23,11,7,0,0,7); x.fill(); x.stroke(); }
  if(who==='rina'||who==='presiden'){ }
  if(who==='presiden'){ x.fillStyle='#111'; x.fillRect(30,30,28,5); }
  if(who==='kepala'){ x.fillStyle='#8a5a2b'; x.beginPath(); x.ellipse(44,26,20,5,0,0,7); x.fill(); x.stroke(); }
  return this.spriteCache[key]=c;
};
