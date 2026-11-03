/* ============================================================
   DATA GAME — President of Economy
   Semua konfigurasi bangunan, barang, misi, kuis, ensiklopedia,
   pencapaian, dan skenario tantangan.
   ============================================================ */
window.GAME = window.GAME || {};

/* ---------- KONSTANTA EKONOMI (nilai simulasi) ---------- */
GAME.CONST = {
  GRID_W: 14, GRID_H: 14,
  START_TREASURY: 100_000_000_000,   // Rp100 miliar
  BASE_UPKEEP_POP: 0.000_000_02,     // pengeluaran publik per penduduk
  STORAGE_BASE: 400,                 // kapasitas gudang awal (unit)
  LABOR_RATIO: 0.55,                 // angkatan kerja vs penduduk
  MAX_LEVEL: 3,
};

/* ---------- BARANG ----------
   perCapita = unit (karung besar) yang diminta per penduduk per periode */
GAME.GOODS = {
  beras:  { name:'Beras',   icon:'🌾', base:12000, perCapita:0.12, elastic:1.2 },
  sayur:  { name:'Sayur',   icon:'🥬', base:8000,  perCapita:0.09, elastic:1.4 },
  daging: { name:'Daging',  icon:'🥩', base:35000, perCapita:0.04, elastic:1.0 },
  produk: { name:'Produk Industri', icon:'📦', base:50000, perCapita:0.05, elastic:0.9 },
};

/* ---------- BANGUNAN ----------
   cost/ops dalam rupiah simulasi. produces: unit/level/periode.
   jobs: pekerja/level. service: kapasitas pelayanan penduduk/level.
*/
GAME.BUILDINGS = [
 // --- Pemerintahan & Keuangan ---
 { id:'kantor', name:'Kantor Pemerintahan', cat:'pemerintahan', icon:'🏛️',
   cost:0, ops:2_000_000_000, jobs:20, income:3_000_000_000,
   desc:'Pusat administrasi negara. Menghasilkan pendapatan administrasi dan membuka menu kebijakan.',
   locked:true },
 { id:'balai', name:'Istana Pemerintahan', cat:'pemerintahan', icon:'🏛️', sprite:'government_palace_01',
   cost:8e9, ops:1e9, jobs:25, income:4e9, unlockCh:4,
   desc:'Istana batu putih berkubah emas dengan serambi berkolom dan taman air mancur. Meningkatkan pendapatan administrasi dan kepuasan warga sekitar.' },
 { id:'bank', name:'Bank Negara', cat:'pemerintahan', icon:'🏦', sprite:'central_bank_01',
   cost:12e9, ops:1.2e9, jobs:30, income:6e9, unlockCh:6,
   desc:'Bank sentral berkubah emas; menambah pendapatan negara dan stabilitas pasar.' },
 { id:'kantor_kaca', name:'Menara Perkantoran', cat:'pemerintahan', icon:'🏢', sprite:'glass_office_01',
   cost:18e9, ops:1.6e9, jobs:60, income:6e9, unlockCh:4,
   desc:'Gedung perkantoran kaca biru dengan teras taman. Menambah pendapatan pajak dan lapangan kerja modern.' },

 // --- Perdagangan ---
 { id:'pasar', name:'Pasar', cat:'perdagangan', icon:'🏪',
   cost:5e9, ops:0.5e9, jobs:20, storage:150, tradeBoost:1.0,
   desc:'Tempat perdagangan barang kebutuhan masyarakat. Tanpa pasar, barang sulit terjual.' },
 { id:'toko', name:'Toko', cat:'perdagangan', icon:'🏬',
   cost:4e9, ops:0.4e9, jobs:10, income:1.5e9, unlockCh:3,
   desc:'Usaha ritel kecil yang menambah pendapatan pajak dan lapangan kerja.' },
 { id:'pusat_perbelanjaan', name:'Pusat Perbelanjaan', cat:'perdagangan', icon:'🛍️', sprite:'shopping_mall_01',
   cost:15e9, ops:1.5e9, jobs:80, income:5e9, storage:200, unlockCh:5,
   desc:'Mal modern dengan atrium kaca, plaza, dan taman. Banyak lapangan kerja dan pendapatan tinggi.' },
 { id:'gudang', name:'Gudang Logistik', cat:'perdagangan', icon:'📦', sprite:'logistics_hub_01',
   cost:5e9, ops:0.5e9, jobs:15, storage:500,
   desc:'Gudang modern dengan dermaga muat dan derek kontainer; memperlancar distribusi barang.', unlockCh:3 },
 { id:'pelabuhan', name:'Pelabuhan', cat:'perdagangan', icon:'🚢',
   cost:18e9, ops:2e9, jobs:60, unlockCh:5, port:true,
   desc:'Membuka ekspor-impor: jual kelebihan stok ke luar negeri dan beli barang saat langka.' },
 { id:'marina', name:'Marina Nusantara', cat:'perdagangan', icon:'⛵', sprite:'marina_01',
   cost:18e9, ops:1.4e9, income:5e9, welfare:2, unlockCh:5, onWater:true,
   desc:'Marina mewah dengan dermaga terapung, yacht, klub kaca, dan promenade. Hanya dapat dibangun di petak air.' },
 { id:'bandara', name:'Bandara', cat:'perdagangan', icon:'✈️',
   cost:25e9, ops:3e9, jobs:90, income:8e9, unlockCh:6,
   desc:'Pintu perdagangan udara dan simbol kota modern.' },
 { id:'hotel', name:'Hotel Bintang Laut', cat:'perdagangan', icon:'🏨', sprite:'modern_hotel_01',
   cost:22e9, ops:2e9, jobs:80, income:7.5e9, welfare:1, unlockCh:5,
   desc:'Hotel mewah berbentuk layar dengan kolam dan taman. Menarik wisatawan, menambah pendapatan dan kesejahteraan.' },
 { id:'menara', name:'Menara Nusantara', cat:'perdagangan', icon:'🏙️', sprite:'skyscraper_tower_01',
   cost:30e9, ops:3e9, jobs:120, income:11e9, welfare:1, unlockCh:6,
   desc:'Ikon kota setinggi langit dengan puncak emas. Pusat bisnis bergengsi dengan banyak lapangan kerja.' },
 { id:'bursa', name:'Bursa Nusantara', cat:'perdagangan', icon:'📈', sprite:'stock_exchange_01',
   cost:28e9, ops:2.8e9, jobs:100, income:10e9, unlockCh:6,
   desc:'Bursa perdagangan dengan pita ticker dan cincin emas. Menarik investasi dan menambah pendapatan negara.' },
 { id:'konvensi', name:'Pusat Konferensi', cat:'perdagangan', icon:'🎤', sprite:'conference_center_01',
   cost:20e9, ops:1.8e9, jobs:60, income:6.5e9, welfare:1, unlockCh:5,
   desc:'Pusat konferensi dan pameran beratap kerang. Mendatangkan wisata bisnis dan menaikkan kesejahteraan.' },

 // --- Produksi ---
 { id:'pertanian', name:'Lahan Pertanian', cat:'produksi', icon:'🌾',
   cost:4e9, ops:0.8e9, jobs:30, produces:{ good:'beras', perLevel:100 },
   desc:'Menghasilkan beras. Fondasi ketahanan pangan Nusantara Raya.' },
 { id:'perkebunan', name:'Perkebunan', cat:'produksi', icon:'🥬',
   cost:5e9, ops:0.9e9, jobs:35, produces:{ good:'sayur', perLevel:90 },
   desc:'Menghasilkan sayur mayur untuk pasar.', unlockCh:2 },
 { id:'peternakan', name:'Peternakan', cat:'produksi', icon:'🐄',
   cost:6e9, ops:1.1e9, jobs:25, produces:{ good:'daging', perLevel:45 },
   desc:'Menghasilkan daging. Permintaan naik seiring kesejahteraan.', unlockCh:4 },
 { id:'pabrik', name:'Pabrik', cat:'produksi', icon:'🏭', sprite:'modern_factory_01',
   cost:10e9, ops:1.5e9, jobs:50, produces:{ good:'produk', perLevel:60 }, powerUse:20,
   desc:'Pabrik modern dengan atap surya dan cerobong bersih. Menghasilkan produk industri dan lapangan kerja besar.', unlockCh:3 },
 { id:'pertambangan', name:'Tambang', cat:'produksi', icon:'⛏️',
   cost:12e9, ops:1.8e9, jobs:60, income:4e9, powerUse:25, unlockCh:6,
   desc:'Mengekspor hasil tambang; pendapatan besar tapi perlu listrik.' },

 // --- Pelayanan Masyarakat ---
 { id:'rumah', name:'Rumah Warga', cat:'pelayanan', icon:'🏠',
   cost:3e9, ops:0.1e9, popPerLevel:120,
   desc:'Tempat tinggal warga. Setiap level menambah ±120 penduduk.' },
 { id:'apartemen', name:'Apartemen Mewah', cat:'pelayanan', icon:'🌆', sprite:'luxury_apartment_01',
   cost:10e9, ops:0.7e9, jobs:20, popPerLevel:260, welfare:1, unlockCh:4,
   desc:'Menara hunian kembar dengan balkon, taman atap, dan kolam. Menampung +260 penduduk per level.' },
 { id:'sekolah', name:'Sekolah', cat:'pelayanan', icon:'🏫', sprite:'modern_school_01',
   cost:7e9, ops:1.2e9, jobs:15, serviceEdu:500,
   desc:'Kampus modern dengan atrium kaca, menara jam, dan panel surya. Mendidik anak bangsa; pendidikan meningkatkan kualitas tenaga kerja & upah.', unlockCh:1 },
 { id:'puskesmas', name:'Puskesmas', cat:'pelayanan', icon:'🏥',
   cost:6e9, ops:0.9e9, jobs:12, serviceHealth:600, unlockCh:5,
   desc:'Fasilitas kesehatan dasar untuk 600 warga per level.' },
 { id:'rumah_sakit', name:'Rumah Sakit', cat:'pelayanan', icon:'⚕️', sprite:'modern_hospital_01',
   cost:12e9, ops:2e9, jobs:40, serviceHealth:2000, unlockCh:5,
   desc:'Menara rumah sakit modern berpita kaca biru dengan helipad dan taman penyembuhan. Layanan kesehatan lengkap untuk 2000 warga per level.' },

 // --- Infrastruktur & Lingkungan ---
 { id:'jalan', name:'Jalan', cat:'infra', icon:'🛣️',
   cost:0.5e9, ops:0.05e9, flat:true,
   desc:'Memperlancar distribusi. Setiap 4 jalan menaikkan sedikit efisiensi seluruh produksi.' },
 { id:'pembangkit', name:'Pembangkit Listrik', cat:'infra', icon:'⚡',
   cost:12e9, ops:2e9, jobs:20, power:200, unlockCh:3,
   desc:'Menyalakan pabrik dan tambang. Tanpa listrik, industri berhenti.' },
 { id:'ipl', name:'Pengolahan Air', cat:'infra', icon:'🚰',
   cost:9e9, ops:1.2e9, jobs:15, unlockCh:6, welfare:2,
   desc:'Air bersih untuk warga; menaikkan kesejahteraan.' },
 { id:'persampahan', name:'Pengelolaan Sampah', cat:'infra', icon:'♻️',
   cost:6e9, ops:0.8e9, jobs:15, unlockCh:6, welfare:3,
   desc:'Kota bersih, warga sehat. Menaikkan kesejahteraan.' },
 { id:'taman', name:'Taman Kota', cat:'infra', icon:'🌳', sprite:'city_park_01',
   cost:2e9, ops:0.2e9, welfare:2,
   desc:'Taman dengan palem, air mancur, gazebo, dan jalur batu. Membuat warga bahagia.', unlockCh:2 },
 { id:'plaza', name:'Plaza & Trotoar', cat:'infra', icon:'🧱', sprite:'plaza_01',
   cost:1.2e9, ops:0.08e9, welfare:1, unlockCh:2, deco:true,
   desc:'Plaza berpaving dengan trotoar, pot palem, bangku, dan lampu taman. Mempercantik kawasan dan menaikkan kesejahteraan.' },
 { id:'air_mancur', name:'Air Mancur Megah', cat:'infra', icon:'⛲', sprite:'fountain_01',
   cost:3e9, ops:0.15e9, welfare:2, unlockCh:3, deco:true,
   desc:'Air mancur marmer tiga tingkat dengan aksen emas dan pancuran beranimasi. Ikon taman kota yang menenangkan warga.' },
 { id:'kolam', name:'Kolam Hias Resort', cat:'infra', icon:'🏊', sprite:'pool_01',
   cost:4e9, ops:0.2e9, welfare:2, unlockCh:5, deco:true,
   desc:'Kolam infinity berair turquoise dengan dek batu, kursi santai, dan payung. Nuansa resor mewah di tengah kota.' },
 { id:'monumen', name:'Monumen', cat:'infra', icon:'🗼',
   cost:8e9, ops:0.3e9, welfare:1, unlockCh:5, deco:true,
   desc:'Ikon kebanggaan nasional; menarik wisatawan.' },
 { id:'jembatan', name:'Jembatan Aurora', cat:'infra', icon:'🌉', sprite:'arch_bridge_01',
   cost:14e9, ops:0.7e9, welfare:2, unlockCh:5, onWater:true, deco:true,
   desc:'Jembatan lengkung futuristik dengan lengkung putih-emas dan lampu LED. Ikon kota; hanya di petak air.' },
];
GAME.BUILDById = {}; GAME.BUILDINGS.forEach(b => GAME.BUILDById[b.id] = b);

/* ---------- KARAKTER (untuk potret SVG) ---------- */
GAME.CHARACTERS = {
  menteri:  { name:'Menteri Ekonomi', style:'suit',  skin:'#e8b98a', hair:'#222', accent:'#1d3557' },
  presiden: { name:'Presiden',        style:'suit',  skin:'#d9a066', hair:'#111', accent:'#e63946' },
  budi:     { name:'Pak Budi (Petani)', style:'farm', skin:'#c98d5a', hair:'#3a2a18', accent:'#43aa55' },
  rina:     { name:'Bu Rina (Pedagang)', style:'trade', skin:'#e8b98a', hair:'#4a2c14', accent:'#f4a261' },
  kepala:   { name:'Kepala Daerah',   style:'office', skin:'#d9a066', hair:'#222', accent:'#8a5a2b' },
};

/* ---------- BAB STORY MODE ----------
   objectives: {t:teks, f:S->bool} — fungsi pemeriksaan pada state.
   reward.unlock: id bangunan yang terbuka setelah bab selesai.
*/
GAME.CHAPTERS = [
 { id:1, title:'Bab 1 — Negara yang Baru Dimulai', topic:'Dasar pembangunan & pengelolaan uang',
   rewardMoney:5e9, rewardUnlock:['sekolah','taman','perkebunan'],
   objectives:[
     { t:'Bangun 1 Pasar',                 f:S=>S.count('pasar')>=1 },
     { t:'Bangun 1 Lahan Pertanian',       f:S=>S.count('pertanian')>=1 },
     { t:'Periksa anggaran di menu Ekonomi', f:S=>S.flags.sawBudget },
     { t:'Akhiri 1 periode',               f:S=>S.month>1 || S.year>1 },
   ]},
 { id:2, title:'Bab 2 — Harga yang Tidak Stabil', topic:'Permintaan, penawaran & keseimbangan pasar',
   rewardMoney:8e9, rewardUnlock:['gudang','pabrik','pembangkit'],
   objectives:[
     { t:'Stok beras ≥ 150 unit',            f:S=>S.goods.beras.stock>=150 },
     { t:'Harga beras kembali Rp9.000–15.000', f:S=>S.goods.beras.price>=9000&&S.goods.beras.price<=15000 },
     { t:'Bangun 1 Gudang Logistik',          f:S=>S.count('gudang')>=1 },
   ]},
 { id:3, title:'Bab 3 — Pabrik dan Lapangan Kerja', topic:'Produksi, biaya & tenaga kerja',
   rewardMoney:10e9, rewardUnlock:['puskesmas','rumah_sakit','balai'],
   objectives:[
     { t:'Bangun 2 Pabrik',                       f:S=>S.count('pabrik')>=2 },
     { t:'Sediakan 1 Pembangkit Listrik',          f:S=>S.count('pembangkit')>=1 },
     { t:'Pengangguran di bawah 15%',              f:S=>S.stats.unemp<15 },
   ]},
 { id:4, title:'Bab 4 — Mengatasi Inflasi', topic:'Inflasi, pasokan & kebijakan ekonomi',
   rewardMoney:12e9, rewardUnlock:['peternakan','pusat_perbelanjaan','pelabuhan','monumen'],
   objectives:[
     { t:'Inflasi di bawah 5%',                    f:S=>S.stats.inflasi<5 },
     { t:'Harga beras & sayur di bawah 130% harga dasar', f:S=>S.goods.beras.price<=GAME.GOODS.beras.base*1.3&&S.goods.sayur.price<=GAME.GOODS.sayur.base*1.3 },
     { t:'Stok pangan (beras+sayur) ≥ 250',        f:S=>S.goods.beras.stock+S.goods.sayur.stock>=250 },
   ]},
 { id:5, title:'Bab 5 — Negara untuk Semua', topic:'Pembangunan manusia & pemerataan',
   rewardMoney:15e9, rewardUnlock:['bank','pertambangan','ipl','persampahan'],
   objectives:[
     { t:'Bangun 2 Sekolah',                       f:S=>S.count('sekolah')>=2 },
     { t:'Bangun 1 Puskesmas atau Rumah Sakit',    f:S=>S.count('puskesmas')+S.count('rumah_sakit')>=1 },
     { t:'Bangun minimal 8 Jalan',                 f:S=>S.count('jalan')>=8 },
     { t:'Kesejahteraan ≥ 60%',                    f:S=>S.stats.welfare>=60 },
   ]},
 { id:6, title:'Bab 6 — Anggaran dalam Bahaya', topic:'Anggaran negara, surplus & defisit',
   rewardMoney:18e9, rewardUnlock:['bandara'],
   objectives:[
     { t:'Surplus 3 periode berturut-turut',       f:S=>S.surplusStreak>=3 },
     { t:'Kas negara ≥ Rp130 miliar',              f:S=>S.treasury>=130e9 },
     { t:'Pendapatan per periode ≥ Rp14 miliar',   f:S=>S.last.income>=14e9 },
   ]},
 { id:7, title:'Bab 7 — Masa Depan Nusantara Raya', topic:'Gabungan seluruh konsep ekonomi',
   rewardMoney:25e9, rewardUnlock:[],
   objectives:[
     { t:'Stok beras ≥ 300 unit',                  f:S=>S.goods.beras.stock>=300 },
     { t:'Pengangguran < 10%',                     f:S=>S.stats.unemp<10 },
     { t:'Inflasi < 5%',                           f:S=>S.stats.inflasi<5 },
     { t:'Kesejahteraan ≥ 70%',                    f:S=>S.stats.welfare>=70 },
     { t:'Kas negara ≥ Rp150 miliar',              f:S=>S.treasury>=150e9 },
   ]},
];

/* ---------- DIALOG CERITA ---------- */
GAME.STORY_INTRO = {
 1:[['presiden','Selamat pagi, Rakyat Nusantara Raya! Hari ini saya resmi dilantik sebagai presiden baru negara kita.'],['menteri','Selamat bertugas, Presiden. Izinkan saya melaporkan: kas negara Rp100 miliar, tetapi harga belum stabil, banyak pengangguran, dan produksi pangan kita kurang.'],['presiden','Kita mulai dari yang paling penting — perut rakyat. Apa langkah pertama kita?'],['menteri','Bangun sebuah PASAR agar petani punya tempat menjual, dan PERTANIAN untuk memproduksi beras. Buka menu Bangun di bawah layar, ya. Anggaran negara bisa dicek di menu Ekonomi. Setelah itu, akhiri periode untuk menjalankan simulasi.']],
 2:[['rina','Pak Presiden, harga beras naik terus! Stok di pasar sedikit, padahal pembeli ramai.'],['presiden','Itu namanya permintaan lebih besar dari penawaran, Bu Rina.'],['budi','Benar, Pak. Lahan kita luas tapi produksi rendah karena fasilitas kurang. Kita juga butuh gudang supaya panen tidak terbuang.'],['menteri','Saran saya: tingkatkan produksi pertanian, bangun gudang logistik, dan jaga harga di kisaran wajar. Cek data permintaan & penawaran di menu Ekonomi — grafik akan membantu Bapak memahami keseimbangan pasar.']],
 3:[['kepala','Laporan dari daerah, Pak Presiden. Banyak pemuda menganggur. Mereka butuh pekerjaan, bukan hanya bantuan.'],['menteri','Kita bisa mendorong sektor industri. Pabrik membuka banyak lapangan kerja dan menghasilkan produk bernilai jual tinggi.'],['presiden','Tapi pabrik butuh listrik dan pekerja terampil, ya?'],['menteri','Betul. Bangun pembangkit listrik, jaga biaya operasional, dan pantau angka pengangguran di dashboard.']],
 4:[['menteri','Situasi serius, Presiden. Harga-harga naik secara umum — kita mengalami inflasi.'],['presiden','Apa penyebabnya?'],['menteri','Campuran: pasokan kurang, biaya produksi naik, dan permintaan tumbuh lebih cepat dari produksi. Tidak ada satu obat untuk semua penyebab.'],['rina','Kalau harga terus naik, pembeli sepi, lapak saya juga rugi, Pak.'],['menteri','Tingkatkan pasokan, perbaiki distribusi, dan gunakan subsidi secara terukur di menu Kebijakan.']],
 5:[['kepala','Pembangunan kota sudah maju, Pak. Tapi ada wilayah yang anak-anaknya sekolah jauh ke luar kota, dan puskesmas belum ada.'],['presiden','Pertumbuhan yang belum merata berarti belum semua warga merasakan hasilnya.'],['menteri','Bangun sekolah dan fasilitas kesehatan, perluas jalan. Pendidikan dan kesehatan menaikkan kualitas tenaga kerja — dan pada akhirnya, pendapatan negara.']],
 6:[['menteri','Laporan anggaran bulan ini mengecewakan, Presiden. Pengeluaran kita melampaui pendapatan.'],['presiden','Berapa lama kita bisa bertahan seperti ini?'],['menteri','Defisit jangka pendek tidak apa-apa untuk mengejar pembangunan. Tapi berkepanjangan, kepercayaan pasar turun dan negara berisiko krisis.'],['presiden','Baik. Kita perbaiki: genjot pendapatan, kendalikan pengeluaran, dan jaga surplus beberapa periode berturut-turut.']],
 7:[['presiden','Tahun-tahun berat telah kita lalui. Kini Nusantara Raya berdiri sebagai negara muda yang diperhitungkan.'],['menteri','Ujian terakhir, Presiden: semuanya harus berjalan bersamaan. Pangan aman, lapangan kerja luas, harga stabil, anggaran sehat, dan rakyat sejahtera.'],['budi','Petani kecil seperti saya hanya ingin harga panen adil dan stok pangan cukup, Pak.'],['rina','Dan pedagang seperti saya ingin pasar yang stabil.'],['menteri','Buktikan bahwa keputusan ekonomi yang baik adalah keputusan yang seimbang. Selamat bertugas, Presiden!']],
};
GAME.STORY_WIN = {
 1:[['menteri','Luar biasa! Pasar dan pertanian pertama kita berdiri. Ini fondasi ekonomi Nusantara Raya.'],['presiden','Baru permulaan. Rakyat menunggu lebih banyak dari kita.']],
 2:[['rina','Harga beras sudah turun ke tingkat yang wajar dan stok aman. Pembeli ramai lagi, terima kasih Pak Presiden!'],['menteri','Bapak baru saja menyaksikan hukum permintaan dan penawaran bekerja.']],
 3:[['kepala','Pabrik-pabrik baru menampung ratusan pekerja, Pak. Pengangguran menurun tajam.'],['menteri','Ingat: lapangan kerja tumbuh dari produksi, dan produksi butuh listrik serta biaya operasional yang terkendali.']],
 4:[['menteri','Inflasi berhasil dikendalikan. Harga-harga stabil kembali.'],['presiden','Ternyata menjaga harga bukan soal menekan harga semurah-murahnya, ya.'],['menteri','Tepat sekali. Yang penting keseimbangan pasokan dan permintaan.']],
 5:[['budi','Anak petani sekarang bisa sekolah dekat rumah, Pak.'],['presiden','Pembangunan yang dinikmati rakyat adalah pembangunan yang berhasil.']],
 6:[['menteri','Anggaran kita surplus tiga periode berturut-turut! Kepercayaan pasar naik.'],['presiden','Disiplin fiskal ternyata bisa dipelajari sambil bermain.']],
 7:[['presiden','Hari ini Nusantara Raya mencapai semuanya: pangan aman, pekerjaan luas, harga stabil, anggaran sehat, rakyat sejahtera.'],['menteri','Rakyat akan mengenang masa jabatan ini. Selamat, Bapak layak menyandang gelar PRESIDEN EKONOMI!']],
};

/* ---------- KUIS ---------- */
GAME.QUIZZES = {
 1:[{ q:'Kas negara awal kita Rp100 miliar. Negara membangun pasar Rp5 miliar. Apa yang terjadi pada kas?',
      o:['Kas tetap Rp100 miliar','Kas berkurang menjadi Rp95 miliar','Kas bertambah Rp5 miliar'], a:1,
      e:'Pembangunan mengurangi kas negara. Setiap pengeluaran memiliki konsekuensi.' },
    { q:'Manakah urutan yang paling tepat untuk memulai ekonomi kota?',
      o:['Bongkar pasar, bangun monumen','Bangun produksi (pertanian) dan tempat jual (pasar)','Hanya menaikkan pajak'], a:1,
      e:'Produksi + perdagangan adalah fondasi: barang dibuat lalu diperjualbelikan.' }],
 2:[{ q:'Jika permintaan beras meningkat sementara penawaran tetap, apa yang mungkin terjadi pada harga?',
      o:['Harga selalu turun','Harga dapat meningkat','Harga pasti tidak berubah'], a:1,
      e:'Dalam kondisi sederhana (faktor lain tetap), permintaan naik + pasokan tetap → harga naik.' },
    { q:'Pada tabel pasar beras: harga Rp12.000 permintaan 60 dan penawaran 60. Titik ini disebut…',
      o:['Kelangkaan','Keseimbangan pasar','Surplus barang'], a:1,
      e:'Saat jumlah diminta = jumlah ditawarkan, harga keseimbangan tercapai.' }],
 3:[{ q:'Pabrik baru membuka 50 pekerjaan tetapi butuh 1,5 miliar/bulan. Biaya bulanan pabrik disebut…',
      o:['Biaya operasional','Pendapatan negara','Subsidi'], a:0,
      e:'Biaya operasional adalah biaya rutin agar usaha berjalan terus.' },
    { q:'Cara paling langsung menurunkan pengangguran adalah…',
      o:['Menaikkan harga barang','Membangun usaha baru yang menyerap pekerja','Menghapus sekolah'], a:1,
      e:'Lapangan kerja tumbuh dari aktivitas produksi dan usaha baru.' }],
 4:[{ q:'Inflasi adalah…',
      o:['Kenaikan harga secara umum dan terus-menerus','Turunnya jumlah uang di bank','Bertambahnya pabrik'], a:0,
      e:'Inflasi = kenaikan tingkat harga secara umum dalam periode tertentu.' },
    { q:'Manakah kebijakan yang dapat MEREDAKAN inflasi dari sisi pasokan?',
      o:['Mencetak uang sebanyak-banyaknya','Meningkatkan produksi dan memperlancar distribusi','Menutup gudang'], a:1,
      e:'Barang yang cukup dan distribusi lancar membuat harga sulit naik.' }],
 5:[{ q:'Membangun sekolah termasuk investasi pada…',
      o:['Sumber daya alam','Sumber daya manusia','Barang modal pemerintah'], a:1,
      e:'Pendidikan meningkatkan kualitas tenaga kerja → produktivitas dan upah naik.' },
    { q:'Jika sebagian wilayah tidak punya sekolah dan puskesmas, dampak jangka panjangnya…',
      o:['Kesenjangan dan kualitas SDM tertinggal','Negara cepat kaya','Tidak berpengaruh'], a:0,
      e:'Pembangunan yang tidak merata membuat sebagian rakyat tertinggal.' }],
 6:[{ q:'APBN: pendapatan Rp12 M, pengeluaran Rp15 M. Kondisi ini disebut…',
      o:['Surplus','Defisit','Seimbang'], a:1,
      e:'Pengeluaran > pendapatan = defisit. Berkepanjangan → risiko krisis anggaran.' },
    { q:'Cara memperbaiki defisit yang paling sehat jangka panjang?',
      o:['Hentikan semua pembangunan','Genjot pendapatan (pajak & produksi) dan prioritaskan pengeluaran','Pinjam tanpa batas'], a:1,
      e:'Perbaikan struktur pendapatan + prioritas belanja lebih berkelanjutan daripada berhenti total.' }],
 7:[{ q:'Kebijakan ekonomi yang baik berarti…',
      o:['Memuaskan satu indikator setinggi mungkin','Menyeimbangkan pangan, pekerjaan, harga, anggaran, dan kesejahteraan','Selalu menolak impor'], a:1,
      e:'Ekonomi saling terhubung — tujuan yang baik biasanya menuntut keseimbangan.' }],
};

/* ---------- ENSIKLOPEDIA ---------- */
GAME.ENCY = [
 { t:'Permintaan', b:'Permintaan adalah jumlah barang yang ingin dan mampu dibeli konsumen pada harga tertentu. Saat harga naik, jumlah yang diminta biasanya turun (ceteris paribus).', ex:'Harga beras naik → pembeli mengurangi porsi atau beralih ke sayur.' },
 { t:'Penawaran', b:'Penawaran adalah jumlah barang yang ingin dan mampu dijual produsen pada harga tertentu. Saat harga naik, produsen terdorong menambah jumlah yang ditawarkan.', ex:'Harga daging tinggi → peternak memperbesar produksi.' },
 { t:'Keseimbangan Pasar', b:'Titik saat jumlah diminta sama dengan jumlah ditawarkan. Harga keseimbangan terbentuk di titik ini.', ex:'Harga Rp12.000: permintaan 60 = penawaran 60 → pasar seimbang.' },
 { t:'Inflasi', b:'Kenaikan tingkat harga secara umum dan terus-menerus. Penyebabnya antara lain pasokan kurang, biaya produksi naik, dan permintaan yang tumbuh lebih cepat dari produksi.', ex:'Inflasi 5%/tahun: barang Rp10.000 tahun lalu menjadi ±Rp10.500.' },
 { t:'Pengangguran', b:'Bagian angkatan kerja yang belum mendapat pekerjaan. Naik saat lapangan kerja tumbuh lebih lambat dari pencari kerja.', ex:'Kota dengan banyak pemuda tapi sedikit pabrik → pengangguran tinggi.' },
 { t:'Produksi', b:'Kegiatan menghasilkan barang/jasa. Dalam game: pertanian menghasilkan beras, pabrik menghasilkan produk industri.', ex:'Pertanian level 2 menghasilkan lebih banyak beras per periode.' },
 { t:'Biaya Produksi', b:'Pengeluaran yang dibutuhkan untuk menghasilkan barang: bahan baku, tenaga kerja, listrik, dan operasional.', ex:'Pabrik butuh listrik; tanpa pembangkit, produksi berhenti tapi biaya tetap jalan.' },
 { t:'Pajak', b:'Iuran wajib kepada negara; sumber pendapatan utama. Pajak tinggi → pendapatan naik tapi belanja masyarakat dan usaha bisa tertekan.', ex:'Menurunkan pajak dari 15% ke 10% mengurangi pendapatan, tapi daya beli warga naik.' },
 { t:'Subsidi', b:'Bantuan negara untuk sektor tertentu agar biaya produksi turun dan pasokan naik. Membantu, tetapi membebani anggaran.', ex:'Subsidi pertanian membuat panen lebih murah dan stok beras cepat pulih.' },
 { t:'Pendapatan & Pengeluaran Negara', b:'Pendapatan: pajak, aktivitas perdagangan, hasil produksi. Pengeluaran: pembangunan, operasional, pendidikan, kesehatan, subsidi. Selisihnya menentukan surplus/defisit.', ex:'Saldo akhir = saldo awal + pendapatan − pengeluaran.' },
 { t:'Surplus & Defisit', b:'Surplus: pendapatan > pengeluaran. Defisit: pengeluaran > pendapatan. Defisit jangka pendek untuk pembangunan tidak otomatis buruk, tetapi berkepanjangan menaikkan risiko krisis.', ex:'3 periode surplus berturut-turut membuat kas negara kuat menghadapi bencana.' },
 { t:'Pertumbuhan Ekonomi & Kesejahteraan', b:'Pertumbuhan = naiknya aktivitas produksi. Kesejahteraan gabungan dari pangan cukup, pekerjaan, pendidikan, kesehatan, dan harga yang terjangkau.', ex:'Kota dengan pabrik dan sekolah memiliki warga berpenghasilan dan sehat → sejahtera.' },
];

/* ---------- PENCAPAIAN ---------- */
GAME.ACHIEVEMENTS = [
 { id:'pendiri', ico:'🏙️', name:'Pendiri Nusantara', d:'Bangun 10 bangunan pertama kotamu.', reward:3e9,
   f:S=>S.totalBuildings()>=10 },
 { id:'ahli_kb', ico:'⚖️', name:'Ahli Keseimbangan', d:'Semua harga barang dalam 90–110% harga dasar dengan stok ≥ 100.', reward:5e9,
   f:S=>Object.values(S.goods).every(g=>g.price>=g.base*0.9&&g.price<=g.base*1.1&&g.stock>=100) },
 { id:'penjaga', ico:'🛡️', name:'Penjaga Anggaran', d:'Surplus 5 periode berturut-turut.', reward:8e9,
   f:S=>S.surplusStreak>=5 },
 { id:'pangan', ico:'🌾', name:'Penyelamat Pangan', d:'Pulihkan stok beras ≥ 250 setelah pernah di bawah 50.', reward:6e9,
   f:S=>S.flags.foodCrisisSeen&&S.goods.beras.stock>=250 },
 { id:'produktif', ico:'🏭', name:'Negara Produktif', d:'Produksi ≥ 400 unit/periode dengan pengangguran < 10%.', reward:8e9,
   f:S=>S.last.production>=400&&S.stats.unemp<10 },
 { id:'visioner', ico:'👑', name:'Presiden Visioner', d:'Selesaikan seluruh Story Mode (7 bab).', reward:20e9,
   f:S=>S.flags.storyDone },
];

/* ---------- CHALLENGE MODE ---------- */
GAME.RANKS = {
  perunggu: { ico:'🥉', name:'Perunggu', val:1 },
  perak:    { ico:'🥈', name:'Perak',    val:2 },
  emas:     { ico:'🥇', name:'Emas',     val:3 },
};
GAME.rankFor = function(ch, periods){
  const r = ch.ratings || {};
  return periods <= r.gold ? 'emas' : periods <= r.silver ? 'perak' : 'perunggu';
};
GAME.rankBadge = rank => (GAME.RANKS[rank] || GAME.RANKS.perunggu).ico;
GAME.CHALLENGES = [
 { id:'ch_pangan', ico:'🌾', name:'Darurat Pangan',
   d:'Kota dilanda gagal panen. Amankan stok beras ≥ 300 dalam 10 periode.',
   setup:'foodCrisis', goal:S=>S.goods.beras.stock>=300, limit:10, ratings:{ gold:5, silver:7 },
   tips:'Bangun/tingkatkan pertanian, tambah gudang agar panen tidak terbuang, dan pertimbangkan subsidi pangan.' },
 { id:'ch_kerja', ico:'👥', name:'Gelombang Pengangguran',
   d:'Ribuan pendatang mencari kerja. Turunkan pengangguran di bawah 8% dalam 12 periode.',
   setup:'jobCrisis', goal:S=>S.stats.unemp<8, limit:12, ratings:{ gold:6, silver:9 },
   tips:'Bangun pabrik dan pembangkit listrik; sekolah menaikkan kualitas tenaga kerja.' },
 { id:'ch_anggaran', ico:'💸', name:'Kas Terbatas',
   d:'Warisan utang membuat kas hanya Rp20 miliar. Kumpulkan Rp80 miliar tanpa defisit 3 periode berturut-turut dalam 15 periode.',
   setup:'poorStart', goal:S=>S.treasury>=80e9&&S.deficitStreak<3, limit:15, ratings:{ gold:8, silver:11 },
   tips:'Naikkan pendapatan lewat pajak wajar & aktivitas usaha, hindari membangun fasilitas mahal terlalu cepat.' },
];

/* ---------- PERISTIWAE ACAK ---------- */
GAME.EVENTS = [
 { id:'banjir', ico:'🌊', name:'Banjir Bandang', type:'bad',
   d:'Banjir merusak lahan pertanian — produksi pangan -40% selama 3 periode.',
   apply:S=>{ S.mod.farm *= 0.6; S.mod.timer.farm = 3; } },
 { id:'hama', ico:'🐛', name:'Wabah Hama', type:'bad',
   d:'Hama menyerang sawah — produksi beras -30% selama 2 periode.',
   apply:S=>{ S.mod.farm *= 0.7; S.mod.timer.farm = 2; } },
 { id:'festival', ico:'🎉', name:'Festival Dagang', type:'good',
   d:'Festival menarik pembeli dari luar — permintaan naik, pendapatan +20% selama 2 periode.',
   apply:S=>{ S.mod.trade *= 1.2; S.mod.timer.trade = 2; } },
 { id:'panen_raya', ico:'☀️', name:'Panen Raya', type:'good',
   d:'Cuaca bersahabat — produksi pangan +35% selama 2 periode.',
   apply:S=>{ S.mod.farm *= 1.35; S.mod.timer.farm = 2; } },
 { id:'harga_dunia', ico:'🌍', name:'Permintaan Global Naik', type:'good',
   d:'Negara tetangga memborong produk kita — harga produk industri naik.',
   apply:S=>{ S.goods.produk.price *= 1.15; } },
 { id:'biaya_minyak', ico:'⛽', name:'Harga Energi Naik', type:'bad',
   d:'Biaya operasional seluruh bangunan +15% selama 3 periode.',
   apply:S=>{ S.mod.ops *= 1.15; S.mod.timer.ops = 3; } },
];

/* ---------- TEKS BANTUAN ---------- */
GAME.TIPS = [
 'Tip: pasar mempercepat penjualan barang — kota tanpa pasar membuat stok menumpuk.',
 'Tip: gudang menambah kapasitas stok; stok melimpah menahan harga agar tidak melonjak.',
 'Tip: pabrik butuh listrik. Cek pasokan listrik di menu Ekonomi.',
 'Tip: pajak tinggi menambah pendapatan tetapi menekan daya beli warga.',
 'Tip: subsidi pertanian menaikkan produksi tetapi membebani anggaran.',
 'Tip: jalan meningkatkan efisiensi distribusi di seluruh kota.',
 'Tip: pendidikan dan kesehatan menaikkan upah warga → pendapatan pajak ikut naik.',
];
GAME.fmtRp = v => {
  const a = Math.abs(v), s = v<0?'-':'';
  if (a >= 1e12) return s+'Rp'+(a/1e12).toFixed(2)+' T';
  if (a >= 1e9)  return s+'Rp'+(a/1e9).toFixed(a/1e9>=10?1:2)+' M';
  if (a >= 1e6)  return s+'Rp'+(a/1e6).toFixed(1)+' jt';
  if (a >= 1e3)  return s+'Rp'+(a/1e3).toFixed(0)+' rb';
  return s+'Rp'+a.toFixed(0);
};
GAME.fmtNum = v => v>=1000 ? (v/1000).toFixed(1)+'rb' : Math.round(v).toString();
