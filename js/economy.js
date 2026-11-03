/* ============================================================
   ECONOMY — simulasi siklus periode (bulan)
   ============================================================ */
window.GAME = window.GAME || {};
const C2 = GAME.CONST;

/* 1 unit barang = 1 ton (1000 kg) nilai perdagangan, agar skala
   transaksi pasar sebanding dengan skala anggaran negara */
const UNIT_VAL = 1000;

/* hitung indikator turunan tanpa mengubah state ( utk display ) */
GAME.derive = function(S){
  let pop = S.population();
  let labor = Math.floor(pop * C2.LABOR_RATIO);
  let jobsNeed = 0, jobsSupplyPower = 0, jobsDemandPower = 0, storage = C2.STORAGE_BASE;
  let eduCap = 0, healthCap = 0, ops = 0, adminIncome = 0, roads = S.roads();
  let parkAmenity = 0, extraWelfare = 0;
  const byGood = {};
  S.grid.forEach(cell=>{
    const b = cell.b; if(!b) return;
    if(b.done===false) return;   // bangunan dalam konstruksi belum memberi manfaat operasional
    const def = GAME.BUILDById[b.id];
    jobsNeed += (def.jobs||0)*b.level;
    jobsSupplyPower += (def.power||0)*b.level;
    jobsDemandPower += (def.powerUse||0)*b.level;
    storage += (def.storage||0)*b.level;
    eduCap += (def.serviceEdu||0)*b.level;
    healthCap += (def.serviceHealth||0)*b.level;
    ops += (def.ops||0)*b.level;
    adminIncome += (def.income||0)*b.level;
    if(b.id==='taman'||b.id==='monumen') parkAmenity += (def.welfare||1)*b.level;
    if(def.welfare && b.id!=='taman' && b.id!=='monumen') extraWelfare += def.welfare*b.level;
    if(def.produces){ const g=def.produces.good; byGood[g]=(byGood[g]||0)+def.produces.perLevel*b.level; }
  });
  const roadEff = 1 + Math.min(0.2, roads*0.015);
  const staffing = labor>0 ? Math.min(1, jobsNeed>0? labor/Math.max(jobsNeed,1):1) : 0;
  const powerRatio = jobsDemandPower>0 ? Math.min(1, jobsSupplyPower/jobsDemandPower) : 1;
  // sebagian warga bekerja di sektor informal (pedagang kaki lima, buruh harian, dsb.)
  const informal = pop*0.25;
  const employed = Math.min(labor, Math.min(labor,jobsNeed) + informal);
  const unemp = labor>0 ? Math.max(0, Math.min(100, (1 - employed/labor)*100)) : 0;
  return { pop, labor, jobsNeed, jobsFilled: Math.min(labor,jobsNeed), employed, informal, unemp, powerSupply:jobsSupplyPower,
    powerDemand:jobsDemandPower, powerOK: powerRatio>=1, powerRatio, storage, eduCap, healthCap,
    ops, adminIncome, roadEff, staffing, powerRatioEff:powerRatio, byGood, parkAmenity, extraWelfare, hasPort: S.count('pelabuhan')>0 };
};

/* ---------- SATU PERIODE SIMULASI ---------- */
GAME.advancePeriod = function(S){
  const D = GAME.derive(S);
  const rep = { income:0, expense:0, production:0, sales:0, goods:{}, notes:[], events:[], net:0 };

  // 1. PRODUKSI
  let totalProd = 0;
  const prod = {};
  for(const [g,amt] of Object.entries(D.byGood)){
    let m = 1;
    if(g==='beras'||g==='sayur') m *= S.mod.farm;
    if(S.subs.pertanian && (g==='beras'||g==='sayur')) m *= 1.25;
    prod[g] = amt * D.staffing * D.powerRatioEff * D.roadEff * m;
    totalProd += prod[g];
  }
  rep.production = totalProd;

  // 2. STOK + GUDANG
  const cap = D.storage;
  for(const g of Object.keys(GAME.GOODS)){
    const before = S.goods[g].stock;
    S.goods[g].stock = Math.min(cap, S.goods[g].stock + (prod[g]||0));
    const spoiled = before + (prod[g]||0) - S.goods[g].stock;
    if(spoiled > 5) rep.notes.push(`${GAME.GOODS[g].icon} ${GAME.GOODS[g].name}: ${Math.round(spoiled)} unit rusak karena gudang penuh — bangun gudang lagi.`);
  }

  // 3. PERMINTAAN & PENJUALAN
  const marketCount = S.count('pasar') + S.count('pusat_perbelanjaan');
  const tradeEff = Math.min(1, 0.35 + marketCount*0.25);
  let salesValue = 0;
  for(const [g,def] of Object.entries(GAME.GOODS)){
    const G = S.goods[g];
    let pc = def.perCapita;
    if(g==='daging') pc *= 0.5 + S.stats.welfare/100;      // daging = barang mewah
    const priceFactor = Math.max(0.35, Math.min(2.2, Math.pow(def.base/G.price, def.elastic)));
    const demand = D.pop * pc * priceFactor * S.mod.trade;
    let sellable = Math.min(demand, G.stock) * tradeEff;
    // ekspor lewat pelabuhan: jual kelebihan stok
    if(D.hasPort && G.stock > demand*1.2){
      const ex = Math.min((G.stock-demand)*0.3, 120);
      sellable += ex; G.stock -= ex; salesValue += ex*G.price*UNIT_VAL*0.9;
    }
    G.stock -= sellable;
    // impor lewat pelabuhan saat langka
    if(D.hasPort && demand - sellable > 40){
      const imp = Math.min(demand-sellable-40, 150);
      rep.importCost = (rep.importCost||0) + imp*G.price*UNIT_VAL*1.25;
      sellable += imp*0.9;
    }
    salesValue += sellable*G.price*UNIT_VAL;
    rep.goods[g] = { demand:Math.round(demand), sold:Math.round(sellable), stock:Math.round(G.stock), price:G.price };
    S.goods[g].sold = sellable; S.goods[g].demand = demand;
  }
  rep.sales = salesValue;

  // 4. HARGA (dinamika permintaan-penawaran)
  let cpiNew = 0, wSum = 0;
  for(const [g,def] of Object.entries(GAME.GOODS)){
    const G = S.goods[g];
    const supply = (prod[g]||0) + G.stock*0.6 + 1;
    const ratio = (G.demand||1) / supply;
    G.price = Math.max(def.base*0.45, Math.min(def.base*2.8, G.price * (1 + 0.20*(ratio-1))));
    if(S.subs.pangan && (g==='beras'||g==='sayur')) G.price *= 0.97;
    const w = def.perCapita*def.base;
    G.idx = G.price/def.base;
    cpiNew += G.idx*w; wSum += w;
  }
  const cpi = cpiNew/wSum;
  S.cpiPrev = S.cpiPrev===undefined ? cpi : S.cpiPrev;
  const monthly = (cpi - S.cpiPrev)/S.cpiPrev*100;
  S.cpiPrev = cpi;
  const inflasiNew = Math.max(-3, Math.min(60, monthly*12*0.35 + (S.subs.pangan?-0.5:0)));
  S.stats.inflasi = Math.round((S.stats.inflasi*0.5 + inflasiNew*0.5)*10)/10;

  // 5. ANGGARAN
  const eduMult = 1 + Math.min(0.5, D.eduCap/Math.max(D.pop,1)*0.5);
  const hltMult = 1 + Math.min(0.4, D.healthCap/Math.max(D.pop,1)*0.4);
  const taxDrag = 1 - Math.max(0, S.taxRate-0.10)*2.2;   // pajak tinggi menekan aktivitas
  const personalTax = S.taxRate * D.pop * 80e6 * eduMult * hltMult * Math.max(0.4,taxDrag);
  const businessTax = S.taxRate * salesValue * 2.5 * Math.max(0.5,taxDrag);
  const retribusi = marketCount>0 ? salesValue*0.10*S.mod.trade : 0;
  let income = personalTax + businessTax + retribusi + D.adminIncome;
  let expense = D.ops * S.mod.ops + D.pop*2.5e6 + (rep.importCost||0);
  if(S.subs.pertanian) expense += 2e9;
  if(S.subs.pangan) expense += 2e9;
  income *= S.mod.trade;
  rep.income = income; rep.expense = expense; rep.net = income-expense;
  S.treasury += income - expense;

  // 6. TENAGA KERJA
  S.stats.unemp = Math.round(D.unemp*10)/10;

  // 7. KESEJAHTERAAN
  const foodDemand = ['beras','sayur','daging'].reduce((n,g)=>n+(S.goods[g].demand||0),0);
  const foodSold = ['beras','sayur','daging'].reduce((n,g)=>n+(S.goods[g].sold||0),0);
  const foodCov = foodDemand>0 ? Math.min(1, foodSold/foodDemand) : 1;
  S.stats.foodSec = Math.round(foodCov*100);
  const empScore = 1 - S.stats.unemp/100;
  const eduScore = Math.min(1, D.eduCap/Math.max(D.pop,1));
  const hltScore = Math.min(1, D.healthCap/Math.max(D.pop,1));
  const afford = ['beras','sayur'].reduce((n,g)=>n+Math.min(1.2, GAME.GOODS[g].base/S.goods[g].price),0)/2;
  const inflScore = Math.max(0, Math.min(1, 1 - S.stats.inflasi/12));
  const amenScore = Math.min(1, (D.parkAmenity*0.12 + D.extraWelfare*0.1));
  const wTarget = (foodCov*25 + empScore*20 + eduScore*15 + hltScore*15 + Math.min(1,afford/1.1)*10 + inflScore*10 + amenScore*5);
  S.stats.welfare = Math.round(S.stats.welfare*0.6 + wTarget*0.4);
  S.stats.growth = Math.round(((totalProd - (S.last.production||totalProd))/Math.max(1,(S.last.production||totalProd)))*1000)/10;

  S.last = { income, expense, production:totalProd, sales:salesValue };

  // 8. SURPLUS / DEFISIT streak
  if(income>=expense){ S.surplusStreak++; S.deficitStreak=0; } else { S.deficitStreak++; S.surplusStreak=0; }
  if(S.deficitStreak>=3) rep.notes.push('⚠️ Defisit berkepanjangan! Kepercayaan pasar menurun — perbaiki pendapatan atau pangkas pengeluaran.');
  if(S.treasury < 0) rep.notes.push('🚨 Kas negara minus! Rakyat gelisah. Segera pangkas pengeluaran besar-besaran.');

  // 9. KRISIS PANGAN flag
  if(S.goods.beras.stock < 50){ S.flags.foodCrisisSeen = true; }

  // 10. PERISTIWAE ACAK
  for(const k of Object.keys(S.mod.timer)){
    if(S.mod.timer[k]>0){ S.mod.timer[k]--; if(S.mod.timer[k]===0) S.mod[k]=1; }
  }
  const canEvent = S.mode!=='story' || S.chapter>=2;
  if(canEvent && Math.random()<0.16){
    const ev = GAME.EVENTS[Math.floor(Math.random()*GAME.EVENTS.length)];
    if(!S.events.some(e=>e.id===ev.id)){ ev.apply(S); S.events.push({id:ev.id, t: (S.month)+ (S.year*12)});
      rep.events.push(ev); rep.notes.push(`${ev.ico} ${ev.name}: ${ev.d}`); }
  }
  S.events = S.events.filter(e=>{ const age = (S.year*12+S.month) - e.t; return age < 4; });

  // 11. WAKTU
  S.month++; if(S.month>12){ S.month=1; S.year++; }

  // 12. SEJARAH utk grafik
  S.history.push({ label:`B${S.month} T${S.year}`, treasury:S.treasury, income, expense,
    inflasi:S.stats.inflasi, unemp:S.stats.unemp, welfare:S.stats.welfare, production:totalProd });
  if(S.history.length>36) S.history.shift();

  // 13. PENCAPAIAN
  const got = [];
  for(const a of GAME.ACHIEVEMENTS){
    if(!S.achievements[a.id] && a.f(S)){ S.achievements[a.id]=true; S.treasury += a.reward; got.push(a); }
  }
  rep.achievements = got;
  return rep;
};
