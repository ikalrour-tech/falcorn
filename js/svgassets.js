/* ============================================================
   SVG ASSETS — aset vektor isometrik resolusi tinggi
   Dimuat sebagai <img> lalu dirasterisasi 3x ke canvas agar tajam
   saat kamera diperbesar. File SVG asli tetap tersimpan & editable.
   ============================================================ */
window.GAME = window.GAME || {};

GAME.SVG_ASSETS = {
  skyscraper_tower_01: {
    src:'assets/svg/buildings/skyscraper_tower_01.svg',
    w:160, h:240, ax:80, ay:208,
    tall:true,
    stars:[26, 30],
    crown:[80, 16],
    fountain:[28, 12],
    lights:[[-20,-60],[18,-52],[-12,-104],[12,-122],[0,-176]],
  },
  modern_hotel_01: {
    src:'assets/svg/buildings/modern_hotel_01.svg',
    w:160, h:240, ax:80, ay:208,
    tall:true,
    stars:[26, 34],
    crown:[70, 20],
    fountain:[32, 15],
    lights:[[-26,-62],[18,-46],[6,-104],[-8,-152],[-10,-186]],
  },
  glass_office_01: {
    src:'assets/svg/buildings/glass_office_01.svg',
    w:160, h:240, ax:80, ay:208,
    tall:true,
    stars:[24, 30],
    crown:[80, 30],
    fountain:[-36, 12],
    lights:[[-22,-54],[18,-46],[-14,-92],[12,-86],[0,-148],[0,-176]],
  },
  luxury_apartment_01: {
    src:'assets/svg/buildings/luxury_apartment_01.svg',
    w:160, h:240, ax:80, ay:208,
    tall:true,
    stars:[26, 32],
    crown:[64, 58],
    fountain:[32, 14],
    lights:[[-22,-62],[14,-50],[-10,-116],[10,-96],[-6,-148],[0,-170]],
  },
  shopping_mall_01: {
    src:'assets/svg/buildings/shopping_mall_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 34],
    crown:[80, 158],
    fountain:[32, 15],
    lights:[[-30,-26],[8,-20],[-12,-52],[26,-46]],
  },
  central_bank_01: {
    src:'assets/svg/buildings/central_bank_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 28],
    crown:[80, 102],
    fountain:[29, 15],
    lights:[[-24,-42],[22,-36],[-6,-84],[6,-68],[-30,-12],[30,-12]],
  },
  city_park_01: {
    src:'assets/svg/buildings/city_park_01.svg',
    w:160, h:160, ax:80, ay:120,
    stars:[20, 18],
    crown:[80, 60],
    fountain:[0, 0],
    lights:[[-36,-4],[36,-4],[0,-26],[-18,-14],[18,-14]],
  },
  modern_factory_01: {
    src:'assets/svg/buildings/modern_factory_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 34],
    crown:[52, 125],
    lights:[[-28,-28],[8,-20],[-8,-62],[18,-54]],
  },
  logistics_hub_01: {
    src:'assets/svg/buildings/logistics_hub_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 30],
    crown:[80, 162],
    lights:[[-28,-18],[22,-14],[-6,-30],[16,-38]],
  },
  stock_exchange_01: {
    src:'assets/svg/buildings/stock_exchange_01.svg',
    w:160, h:240, ax:80, ay:208,
    tall:true,
    stars:[24, 28],
    crown:[80, 67],
    fountain:[30, 14],
    lights:[[-24,-42],[22,-34],[-10,-80],[10,-58],[0,-112]],
  },
  conference_center_01: {
    src:'assets/svg/buildings/conference_center_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 28],
    crown:[88, 87],
    fountain:[32, 16],
    lights:[[-28,-20],[20,-16],[-8,-50],[12,-38]],
  },
  marina_01: {
    src:'assets/svg/buildings/marina_01.svg',
    w:160, h:200, ax:80, ay:140,
    stars:[20, 26],
    crown:[42, 107],
    lights:[[-32, 2],[32, -1],[-5, -22],[0, 14]],
  },
  arch_bridge_01: {
    src:'assets/svg/buildings/arch_bridge_01.svg',
    w:160, h:200, ax:80, ay:140,
    stars:[20, 30],
    crown:[84, 73],
    lights:[[4, -57],[-20, -35],[28, -40],[-26, -2],[26, 2]],
  },
  government_palace_01: {
    src:'assets/svg/buildings/government_palace_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[26, 30],
    crown:[80, 54],
    fountain:[32, 14],
    lights:[[-42,-46],[38,-42],[-16,-86],[16,-78],[0,-118]],
  },
  modern_hospital_01: {
    src:'assets/svg/buildings/modern_hospital_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[26, 32],
    crown:[80, 44],
    fountain:[32, 14],
    lights:[[-28,-58],[28,-54],[-22,-110],[22,-102],[0,-152]],
  },
  modern_school_01: {
    src:'assets/svg/buildings/modern_school_01.svg',
    w:160, h:240, ax:80, ay:208,
    stars:[24, 30],
    crown:[80, 70],
    fountain:[42, 12],
    lights:[[-36,-36],[30,-34],[-14,-68],[12,-62]],
  },
  /* --- dekorasi kota --- */
  palm_01: {
    src:'assets/svg/decorations/palm_01.svg',
    w:120, h:160, ax:60, ay:142,
    decor:true,
  },
  fountain_01: {
    src:'assets/svg/decorations/fountain_01.svg',
    w:160, h:160, ax:80, ay:129,
    fountain:[0, -16],
    lights:[[-26,-4],[26,-4],[0,-30]],
    decor:true,
  },
  pool_01: {
    src:'assets/svg/decorations/pool_01.svg',
    w:160, h:160, ax:80, ay:129,
    fountain:[0, 0],
    lights:[[-30,-2],[30,-2]],
    decor:true,
  },
  plaza_01: {
    src:'assets/svg/decorations/plaza_01.svg',
    w:160, h:160, ax:80, ay:129,
    lights:[[-30,-2],[30,-2],[0,-18]],
    decor:true,
  },
  street_lamp_01: {
    src:'assets/svg/decorations/street_lamp_01.svg',
    w:64, h:140, ax:32, ay:124,
    decor:true,
  },
  road_01: {
    src:'assets/svg/decorations/road_01.svg',
    w:132, h:80, ax:66, ay:40,
    decor:true, tile:true,
  },
};

const SVG_RASTER = 3;
GAME._svg = { images:{}, rims:{}, ready:{}, failed:{}, total:0, done:0, readyFns:[] };

GAME.svgAssetForBuilding = function(buildingId){
  const def = GAME.BUILDById && GAME.BUILDById[buildingId];
  return def && def.sprite && GAME.SVG_ASSETS[def.sprite] ? def.sprite : null;
};
GAME.svgMetaForBuilding = function(buildingId){
  const asset = GAME.svgAssetForBuilding(buildingId);
  return asset ? GAME.SVG_ASSETS[asset] : null;
};
GAME.svgReadyForBuilding = function(buildingId){
  const asset = GAME.svgAssetForBuilding(buildingId);
  return !!asset && !!GAME._svg.ready[asset];
};

/* menara tinggi: diberi jarak 1 petak dari menara lain agar siluet tidak bertumpuk */
GAME.buildingIsTall = function(buildingId){
  const def = GAME.BUILDById && GAME.BUILDById[buildingId];
  if(!def || !def.sprite) return false;
  const meta = GAME.SVG_ASSETS[def.sprite];
  return !!(meta && meta.tall);
};
GAME.hasTallNeighbor = function(S, gx, gy){
  const GW=GAME.CONST.GRID_W, GH=GAME.CONST.GRID_H;
  for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++){
    if(!dx && !dy) continue;
    const nx=gx+dx, ny=gy+dy;
    if(nx<0 || ny<0 || nx>=GW || ny>=GH) continue;
    const c=S.grid[ny*GW+nx];
    if(c && c.b && GAME.buildingIsTall(c.b.id)) return true;
  }
  return false;
};
GAME.tallSpacingBlocked = function(S, buildingId, gx, gy){
  return !!(S && GAME.buildingIsTall(buildingId) && GAME.hasTallNeighbor(S, gx, gy));
};

function svgLevelDetails(ctx, meta, level, assetId){
  if(level < 2) return;
  ctx.save();
  // cincin emas penanda bangunan yang sudah ditingkatkan
  ctx.strokeStyle = 'rgba(233,196,106,' + (level >= 3 ? .95 : .7) + ')';
  ctx.lineWidth = level >= 3 ? 2 : 1.5;
  ctx.beginPath();
  ctx.moveTo(meta.ax, meta.ay - 24);
  ctx.lineTo(meta.ax + 50, meta.ay);
  ctx.lineTo(meta.ax, meta.ay + 23);
  ctx.lineTo(meta.ax - 50, meta.ay);
  ctx.closePath();
  ctx.stroke();
  if(level >= 3){
    ctx.strokeStyle = 'rgba(255,240,174,.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(meta.ax, meta.ay - 17);
    ctx.lineTo(meta.ax + 38, meta.ay);
    ctx.lineTo(meta.ax, meta.ay + 16);
    ctx.lineTo(meta.ax - 38, meta.ay);
    ctx.closePath();
    ctx.stroke();
    // jendela yang menyala + halo mahkota
    const cx = meta.ax + (meta.crown ? meta.crown[0] - meta.ax : 0);
    const cy = meta.ay + (meta.crown ? meta.crown[1] - meta.ay : -180);
    const halo = ctx.createRadialGradient(cx, cy, 1, cx, cy, 30);
    halo.addColorStop(0, 'rgba(255,231,150,.8)');
    halo.addColorStop(1, 'rgba(255,231,150,0)');
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.fill();
    const win = assetId === 'modern_hotel_01'
      ? [[-12,-64],[12,-48],[2,-110]]
      : assetId === 'glass_office_01'
        ? [[-18,-58],[14,-44],[-10,-96],[8,-80]]
        : [[-18,-62],[16,-54],[-10,-108],[10,-124]];
    for(const [dx,dy] of win){
      ctx.fillStyle = 'rgba(255,226,140,.9)';
      ctx.fillRect(meta.ax + dx - 1.5, meta.ay + dy - 2, 3, 4);
    }
  }
  ctx.restore();
}

/* garis tepi hangat pada menara: memisahkan siluet saat gedung berdekatan */
const TALL_RIM_COLOR = 'rgba(255,240,197,.92)';
function composeTallRim(mask, base){
  const w=base.width, h=base.height;
  const sil=document.createElement('canvas'); sil.width=w; sil.height=h;
  const sctx=sil.getContext('2d'); sctx.drawImage(mask,0,0);
  sctx.globalCompositeOperation='source-in';
  sctx.fillStyle=TALL_RIM_COLOR; sctx.fillRect(0,0,w,h);
  const rim=document.createElement('canvas'); rim.width=w; rim.height=h;
  const rctx=rim.getContext('2d');
  const off=6;
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]])
    rctx.drawImage(sil, dx*off, dy*off);
  rctx.drawImage(base,0,0);
  return rim;
}
function makeTallRim(base){
  try{
    const w=base.width, h=base.height;
    const mask=document.createElement('canvas'); mask.width=w; mask.height=h;
    const mctx=mask.getContext('2d'); mctx.drawImage(base,0,0);
    const px=mctx.getImageData(0,0,w,h), d=px.data;
    // buang bayangan tanah semi-transparan agar rim hanya mengikuti tubuh gedung
    for(let i=3;i<d.length;i+=4) d[i] = d[i]>=128 ? 255 : 0;
    mctx.putImageData(px,0,0);
    return composeTallRim(mask, base);
  }catch(e){
    // canvas ter-taint di file:// → rim tetap dibuat tanpa threshold
    return composeTallRim(base, base);
  }
}

GAME.getSvgBuildingSprite = function(assetId, level){
  const meta = GAME.SVG_ASSETS[assetId];
  const base = GAME._svg.images[assetId];
  if(!meta || !base) return null;
  const key = 'SVG:' + assetId + ':' + level;
  if(GAME.spriteCache[key]) return GAME.spriteCache[key];
  const visual = (meta.tall && GAME._svg.rims[assetId]) || base;
  if(level === 1){
    visual.ax = meta.ax; visual.ay = meta.ay;
    visual.drawW = meta.w; visual.drawH = meta.h;
    visual.svg = true;
    return (GAME.spriteCache[key] = visual);
  }
  const cv = document.createElement('canvas');
  cv.width = base.width; cv.height = base.height;
  const ctx = cv.getContext('2d');
  ctx.drawImage(visual, 0, 0);
  ctx.setTransform(SVG_RASTER, 0, 0, SVG_RASTER, 0, 0);
  svgLevelDetails(ctx, meta, level, assetId);
  if(GAME.drawStars && meta.stars) GAME.drawStars(ctx, meta.stars[0], meta.stars[1], level);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  cv.ax = meta.ax; cv.ay = meta.ay;
  cv.drawW = meta.w; cv.drawH = meta.h;
  cv.svg = true;
  return (GAME.spriteCache[key] = cv);
};

GAME.whenSvgReady = function(fn){
  const st = GAME._svg;
  if(st.done >= st.total) { try{ fn(); }catch(e){ console.warn(e); } return; }
  st.readyFns.push(fn);
};

/* gambar aset SVG (gedung atau dekorasi) dengan titik jangkar di (x,y) */
GAME.drawSvgAsset = function(ctx, assetId, x, y, scale, opts){
  const st = GAME._svg, img = st.images[assetId], meta = GAME.SVG_ASSETS[assetId];
  if(!img || !meta) return false;
  scale = scale || 1;
  const o = opts || {};
  ctx.save();
  ctx.translate(x, y);
  if(o.rot) ctx.rotate(o.rot);
  if(o.flip) ctx.scale(-1, 1);
  if(o.alpha != null) ctx.globalAlpha *= o.alpha;
  ctx.drawImage(img, -meta.ax * scale, -meta.ay * scale, meta.w * scale, meta.h * scale);
  ctx.restore();
  return true;
};
GAME.drawDecorSprite = GAME.drawSvgAsset;
GAME.svgAssetReady = assetId => !!(GAME._svg && GAME._svg.ready[assetId]);

function invalidateSpriteForAsset(assetId){
  if(!GAME.spriteCache) return;
  for(const key of Object.keys(GAME.spriteCache)){
    const m = key.match(/^(.+)_(\d+)$/);
    if(m && GAME.svgAssetForBuilding(m[1]) === assetId) delete GAME.spriteCache[key];
  }
}

(function loadSvgAssets(){
  const st = GAME._svg;
  const entries = Object.entries(GAME.SVG_ASSETS);
  st.total = entries.length;
  const finish = (assetId)=>{
    st.done++;
    if(st.done === st.total){
      const fns = st.readyFns.splice(0);
      fns.forEach(fn=>{ try{ fn(); }catch(e){ console.warn('SVG ready callback', e); } });
    }
  };
  for(const [assetId, meta] of entries){
    const img = new Image();
    img.decoding = 'async';
    img.onload = ()=>{
      const base = document.createElement('canvas');
      base.width = meta.w * SVG_RASTER;
      base.height = meta.h * SVG_RASTER;
      const ctx = base.getContext('2d');
      ctx.drawImage(img, 0, 0, base.width, base.height);
      st.images[assetId] = base;
      if(meta.tall){
        const rim = makeTallRim(base);
        if(rim) st.rims[assetId] = rim;
      }
      st.ready[assetId] = true;
      invalidateSpriteForAsset(assetId);
      if(meta.tile && GAME.spriteCache){
        for(const key of Object.keys(GAME.spriteCache)) if(key.startsWith('Troad')) delete GAME.spriteCache[key];
      }
      finish(assetId);
    };
    img.onerror = ()=>{
      st.failed[assetId] = true;
      console.warn('Aset SVG gagal dimuat:', meta.src);
      finish(assetId);
    };
    img.src = meta.src;
  }
})();
