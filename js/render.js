/* ============================================================
   RENDER — peta isometrik, kamera, animasi
   ============================================================ */
window.GAME = window.GAME || {};

const TW=128, TH=64;
const R = GAME.R = {
  canvas:null, ctx:null, cam:{x:0,y:0,zoom:1}, floats:[], hover:null,
  shake:0,
};

GAME.initRender = function(canvas){
  R.canvas = canvas; R.ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
};
function resize(){
  const dpr = Math.min(2, window.devicePixelRatio||1);
  R.canvas.width = R.canvas.clientWidth*dpr;
  R.canvas.height = R.canvas.clientHeight*dpr;
  R.dpr = dpr;
}
GAME.tileToScreen = (gx,gy)=>({ x:(gx-gy)*TW/2, y:(gx+gy)*TH/2 });
GAME.clientToWorld = (px,py)=>{
  const W = R.canvas.clientWidth, H = R.canvas.clientHeight;
  return { x:(px - W/2)/R.cam.zoom + R.cam.x, y:(py - H/2)/R.cam.zoom + R.cam.y };
};
GAME.screenToTile = (px,py)=>{
  const dpr=R.dpr||1;
  const W = R.canvas.width/dpr, H = R.canvas.height/dpr;
  const wx = (px - W/2)/R.cam.zoom + R.cam.x;
  const wy = (py - H/2)/R.cam.zoom + R.cam.y;
  const gx = Math.floor((wx/(TW/2) + wy/(TH/2))/2 + 1e-6);
  const gy = Math.floor((wy/(TH/2) - wx/(TW/2))/2 + 1e-6);
  return {gx,gy};
};
GAME.centerCam = function(){
  const c = GAME.tileToScreen(GAME.CONST.GRID_W/2, GAME.CONST.GRID_H/2);
  R.cam.x = c.x; R.cam.y = c.y + 40;
};
GAME.floatText = function(gx,gy,txt,color){
  const p = GAME.tileToScreen(gx+0.5,gy+0.5);
  R.floats.push({x:p.x,y:p.y-40,txt,color,t:0});
};

GAME.drawFrame = function(S, ui){
  const c=R.canvas, ctx=R.ctx, dpr=R.dpr||1;
  if(c.clientWidth*dpr !== c.width || c.clientHeight*dpr !== c.height) resize();
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const W=c.width/dpr, H=c.height/dpr;
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#9ed8f5'); g.addColorStop(1,'#e8f6fd');
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);

  let sx=0, sy=0;
  if(R.shake>0){ sx=(Math.random()-.5)*R.shake*8; sy=(Math.random()-.5)*R.shake*8; R.shake*=0.86; if(R.shake<0.05)R.shake=0; }
  ctx.setTransform(R.cam.zoom*dpr,0,0,R.cam.zoom*dpr, (W/2 - R.cam.x*R.cam.zoom + sx)*dpr, (H/2 - R.cam.y*R.cam.zoom + sy)*dpr);

  const GW=GAME.CONST.GRID_W, GH=GAME.CONST.GRID_H;
  // tiles
  for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
    const cell=S.grid[gy*GW+gx]; const p=GAME.tileToScreen(gx,gy);
    ctx.save(); ctx.translate(p.x, p.y);
    if(cell.road){
      const conn = {
        n: gy>0 && S.grid[(gy-1)*GW+gx].road, s: gy<GH-1 && S.grid[(gy+1)*GW+gx].road,
        e: gx<GW-1 && S.grid[gy*GW+gx+1].road, w: gx>0 && S.grid[gy*GW+gx-1].road };
      ctx.drawImage(GAME.getTileCanvas('road',conn), -66,-40);
    } else {
      const v = (gx*7+gy*13)%8;
      ctx.drawImage(GAME.getTileCanvas(cell.terrain, v), -66,-40);
    }
    ctx.restore();
  }
  const palmT=GAME.City?GAME.City.t:0;
  // highlight hover / buildable
  if(R.hover){
    const {gx,gy}=R.hover; const cell=GAME.cellAt(S,gx,gy);
    if(cell){
      const p=GAME.tileToScreen(gx,gy);
      ctx.save(); ctx.translate(p.x,p.y);
      diamondPath(ctx,0,0,TW/2-2,TH/2-1);
      ctx.strokeStyle = cell.b ? '#f4a261' : (ui.buildSel ? (canPlace(S,cell,gx,gy)?'#43aa55':'#e63946') : '#1d3557');
      ctx.lineWidth=3.5; ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.25)'; ctx.fill();
      ctx.restore();
    }
  }
  // bangunan + warga + kendaraan (urutan pelukis: semakin selatan semakin depan)
  const list=[];
  for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){ const cell=S.grid[gy*GW+gx]; if(cell.b) list.push({ d:gx+gy, gx, gy, b:cell.b }); }
  // dekorasi lingkungan ikut urutan pelukis agar tidak menembus gedung
  for(let gy=0;gy<GH;gy++) for(let gx=0;gx<GW;gx++){
    const cell=S.grid[gy*GW+gx];
    if(cell.terrain==='grass' && !cell.b && !cell.road && (gx*7+gy*13)%9===0){
      list.push({ d:gx+gy, gx, gy, kind:'decor', asset:'palm_01', dx:-22, dy:10, scale:.46,
        flip:(gx+gy)%2===1 });
    }
    if(cell.road && (gx*2+gy)%5===0){
      list.push({ d:gx+gy, gx, gy, kind:'decor', asset:'street_lamp_01', dx:-34, dy:12, scale:.5 });
    }
  }
  if(GAME.City) GAME.City.collect(S, it=>list.push(it));
  list.sort((a,b)=>a.d-b.d);
  const now=Date.now();
  for(const it of list){
    if(it.kind==='decor'){
      const pp=GAME.tileToScreen(it.gx,it.gy);
      const sway=Math.sin(palmT*1.1+it.gx*.8+it.gy*1.3)*(it.asset==='palm_01'?.035:0);
      const drawn=GAME.drawDecorSprite && GAME.drawDecorSprite(ctx,it.asset,pp.x+it.dx,pp.y+it.dy,it.scale,
        { rot:sway, flip:!!it.flip });
      if(!drawn && it.asset==='palm_01'){
        GAME.drawPalmTree(ctx, pp.x-30, pp.y+4, .8, Math.sin(palmT*1.1+it.gx*.8+it.gy*1.3));
      } else if(!drawn){
        ctx.save(); ctx.translate(pp.x+it.dx, pp.y+it.dy);
        ctx.strokeStyle='#2f3b48'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-42); ctx.quadraticCurveTo(0,-50,10,-50); ctx.stroke();
        ctx.fillStyle='#ffe9a1'; ctx.beginPath(); ctx.ellipse(10,-50,5,2.6,0,0,7); ctx.fill(); ctx.restore();
      }
      continue;
    }
    if(it.kind){ GAME.City.paint(ctx, it); continue; }
    const {gx,gy,b}=it;
    const p=GAME.tileToScreen(gx,gy);
    const spr=GAME.getSprite(b.id,b.level);
    const ax=spr.ax!=null?spr.ax:66, ay=spr.ay!=null?spr.ay:120;
    const sw=spr.drawW||spr.width, sh=spr.drawH||spr.height;
    const age=(now-(b.born||0))/1000;
    const building = b.done===false;
    ctx.save(); ctx.translate(p.x-ax, p.y-ay);
    if(building){
      ctx.globalAlpha=0.5; ctx.drawImage(spr,0,0,sw,sh); ctx.globalAlpha=1;
      ctx.strokeStyle='#8a5a2b'; ctx.lineWidth=4; ctx.lineJoin='round';
      ctx.strokeRect(16,42,80,70);
      ctx.beginPath(); ctx.moveTo(16,42); ctx.lineTo(96,112); ctx.moveTo(96,42); ctx.lineTo(16,112); ctx.stroke();
      ctx.fillStyle='#c9a227'; ctx.fillRect(52,58,28,10); ctx.strokeRect(52,58,28,10); // material
      ctx.fillStyle='#e05a2b'; ctx.beginPath(); ctx.arc(30,64,7,0,7); ctx.fill(); ctx.stroke(); // molen sederhana
    } else if(age<1.2){ const k=Math.min(1,age/1.2); ctx.globalAlpha=0.35+0.65*k;
      ctx.translate(ax,ay); ctx.translate(0,(1-k)*30); ctx.scale(0.8+0.2*k,0.8+0.2*k); ctx.translate(-ax,-ay); }
    ctx.drawImage(spr, 0, 0, sw, sh);
    ctx.restore();
    if(building){ // batang kemajuan konstruksi (jam simulasi — tidak bergantung framerate)
      const pct=Math.max(0.04, Math.min(1,(b.cT||0)/(b.cDur||8)));
      ctx.save(); ctx.translate(p.x, p.y-(ay+18));
      ctx.fillStyle='rgba(29,53,87,.85)'; ctx.fillRect(-31,-3,62,9);
      ctx.fillStyle='#e9c46a'; ctx.fillRect(-29,-1,58*pct,5);
      ctx.strokeStyle='#1d3557'; ctx.lineWidth=1.5; ctx.strokeRect(-31,-3,62,9);
      ctx.font='bold 10px Trebuchet MS, sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#fff';
      ctx.fillText('🚧 '+Math.round(pct*100)+'%', 0, -8); ctx.restore();
    }
    // selected ring
    if(ui.sel && ui.sel[0]===gx && ui.sel[1]===gy){
      ctx.save(); ctx.translate(p.x,p.y);
      diamondPath(ctx,0,0,TW/2-2,TH/2-1); ctx.strokeStyle='#ffd34d'; ctx.lineWidth=4; ctx.setLineDash([9,7]);
      ctx.lineDashOffset = -now/60; ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    }
  }
  // ghost bangunan
  if(ui.buildSel && R.hover){
    const {gx,gy}=R.hover; const cell=GAME.cellAt(S,gx,gy);
    if(cell){
      const p=GAME.tileToScreen(gx,gy);
      const gs=GAME.getSprite(ui.buildSel,1);
      const gax=gs.ax!=null?gs.ax:66, gay=gs.ay!=null?gs.ay:120;
      ctx.save(); ctx.globalAlpha=0.65;
      ctx.translate(p.x-gax, p.y-gay);
      ctx.drawImage(gs,0,0,gs.drawW||gs.width,gs.drawH||gs.height);
      ctx.restore();
      if(!canPlace(S,cell,gx,gy)){ ctx.save(); ctx.translate(p.x,p.y); diamondPath(ctx,0,0,TW/2-4,TH/2-2);
        ctx.fillStyle='rgba(230,57,70,.35)'; ctx.fill(); ctx.restore(); }
    }
  }
  // floating texts
  R.floats = R.floats.filter(f=>{
    f.t+=1/60; if(f.t>1.6) return false;
    ctx.save(); ctx.globalAlpha=Math.max(0,1-f.t/1.6);
    ctx.font='bold 20px Trebuchet MS, sans-serif'; ctx.textAlign='center';
    ctx.lineWidth=4; ctx.strokeStyle='#fff'; ctx.strokeText(f.txt, f.x, f.y - f.t*30);
    ctx.fillStyle=f.color; ctx.fillText(f.txt, f.x, f.y - f.t*30); ctx.restore();
    return true;
  });
  // corak warna malam (dunia masih dalam transform kamera)
  const dark = GAME.City? GAME.City.darkness(S.clock) : 0;
  if(dark>0.02){
    const W2=W/R.cam.zoom, H2=H/R.cam.zoom;
    ctx.save(); ctx.globalAlpha=dark; ctx.fillStyle='#16255c';
    ctx.fillRect(R.cam.x-W2/2-80, R.cam.y-H2/2-100, W2+160, H2+200); ctx.restore();
  }
  // air mancur tetap beranimasi siang & malam; lapisan malam tidak menutupinya
  if(GAME.City) GAME.City.drawAmbient(ctx,S,list);
  if(GAME.City && dark>0.12){
    for(const it of list) if(!it.kind) GAME.City.drawLights(ctx,it.gx,it.gy,it.b.level,S,it.b.id);
    GAME.City.drawRoadLights(ctx,S);
  }
  // gelembung keluhan di atas semuanya
  if(GAME.City) GAME.City.drawTop(ctx,S);
};
function diamondPath(ctx,x,y,hw,hh){ ctx.beginPath(); ctx.moveTo(x,y-hh); ctx.lineTo(x+hw,y); ctx.lineTo(x,y+hh); ctx.lineTo(x-hw,y); ctx.closePath(); }
function canPlace(S,cell,gx,gy){
  if(!cell || cell.b || cell.road) return false;
  const sel=GAME.ui&&GAME.ui.buildSel;
  const def=sel&&GAME.BUILDById&&GAME.BUILDById[sel];
  if(def&&def.onWater) return cell.terrain==='water';
  if(def && GAME.tallSpacingBlocked && GAME.tallSpacingBlocked(S,sel,gx,gy)) return false;
  return cell.terrain==='grass';
}
GAME.canPlaceTile = (S,gx,gy)=>canPlace(S,GAME.cellAt(S,gx,gy),gx,gy);
GAME.cellAt = (S,gx,gy)=>{ if(gx<0||gy<0||gx>=GAME.CONST.GRID_W||gy>=GAME.CONST.GRID_H) return null; return S.grid[gy*GAME.CONST.GRID_W+gx]; };
