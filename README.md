# President of Economy — Bangun Negara, Pahami Ekonomi

Game edukasi simulasi ekonomi & pembangunan kota 2D isometrik berdasarkan GDD (`gdd.md`)
dan lembar aset "Lembar Aset Game Ekonomi Nusantara".

## Cara Bermain

Buka `index.html` di browser (double-click juga bisa), atau jalankan server lokal:

```
python3 -m http.server 8000
# buka http://localhost:8000
```

Dapat dimainkan di **PC (mouse)** dan **HP (sentuh)** — seret untuk menggeser peta,
roda mouse / cubit / tombol +− untuk zoom.

## Fitur (sesuai GDD)

- **Story Mode 7 bab** — dialog Menteri Ekonomi, Pak Budi, Bu Rina, Kepala Daerah;
  tiap bab diakhiri kuis edukasi + hadiah unlock bangunan.
- **Peta kota isometrik 14×14** — 34 jenis bangunan; **19 di antaranya memakai aset
  SVG** bergaya kota modern terinspirasi Dubai: Menara Nusantara, Hotel Bintang Laut,
  Menara Perkantoran, Apartemen Mewah, Pusat Perbelanjaan, Bank Negara, Bursa Nusantara,
  Pusat Konferensi, Pabrik Modern, Gudang Logistik, Taman Kota, Marina Nusantara,
  Jembatan Aurora, **Istana Pemerintahan**, **Rumah Sakit Modern**, **Sekolah Modern**,
  **Plaza & Trotoar**, **Air Mancur Megah**, dan **Kolam Hias Resort**.
  Marina dan jembatan hanya dapat dibangun di petak air; plaza, air mancur, dan kolam
  adalah dekorasi kota yang menambah kesejahteraan.
- **Sistem ekonomi penuh**: anggaran (surplus/defisit), pajak (slider 5–25%), subsidi,
  produksi 4 barang, stok & gudang, harga terbentuk dari permintaan–penawaran,
  inflasi, pengangguran (formal + informal), kesejahteraan, listrik, distribusi (jalan),
  ekspor–impor lewat pelabuhan.
- **Laporan akhir periode**, grafik tren indikator, dashboard HUD.
- **Misi tambahan, 6 pencapaian, 3 tantangan Challenge Mode berperingkat** — target waktu,
  medali 🥇🥈🥉, dan rekor terbaik tersimpan — plus Free Build.
- **Efek kota hidup**: siklus siang–malam, lampu jendela, lampu jalan di persimpangan,
  air mancur beranimasi, palem bergoyang halus, kendaraan & warga, konstruksi bertahap.
  Menara tinggi memiliki rim cahaya pemisah siluet dan aturan jarak 1 petak agar skyline
  tetap terbaca; bangunan level 2–3 mendapat cincin emas, bintang, dan titik jendela
  yang menyala.
- **Ensiklopedia ekonomi (12 materi)**, pengaturan audio yang tersimpan, kredit.
- **Simpan/muat progres otomatis** (localStorage), dukungan sentuh (seret, cubit,
  ketuk dua kali untuk batal membangun), serta layout responsif PC & HP.

## Visual Kota & Aset SVG

Source vektor gedung berada di `assets/svg/buildings/` (16 file) dan dekorasi di
`assets/svg/decorations/` (6 file): palem, lampu jalan, jalan raya, plaza, air mancur,
dan kolam. Semua file SVG asli tetap tersimpan dan bisa diedit.
`js/svgassets.js` memuat SVG sebagai gambar, merasterisasinya 3× ke canvas agar tajam
saat kamera diperbesar, lalu menyimpannya di cache sprite. Level 1 memakai canvas dasar
bersama; varian level 2–3 dibuat sesuai kebutuhan. Tidak ada filter SVG berat dan tidak
diperlukan konversi manual ke PNG — rasterisasi berlangsung otomatis di browser.

Bangunan yang memakai SVG: `bank`, `kantor_kaca`, `pusat_perbelanjaan`, `hotel`, `menara`,
`apartemen`, `taman`, `pabrik`, `gudang`, `bursa`, `konvensi`, `marina`, `jembatan`,
`balai` (Istana Pemerintahan), `sekolah` (Sekolah Modern), `rumah_sakit` (Rumah Sakit
Modern), `plaza`, `air_mancur`, dan `kolam`. Bangunan air memakai penanda `onWater:true`.
Bangunan lain tetap memakai sprite prosedural lama agar seluruh fitur dan save lama
tetap kompatibel.

Dekorasi lingkungan terhubung otomatis ke renderer: pohon palem SVG tumbuh di petak
rumput kosong dengan animasi goyang halus, lampu jalan SVG berdiri di tepi jalan dan
menyala saat malam, tekstur jalan raya SVG dipakai untuk seluruh petak jalan, dan air
mancur/kolam beranimasi partikel air. Semua digambar mengikuti urutan kedalaman yang
sama dengan gedung sehingga tidak saling menembus.

### Cara menambah gedung SVG baru

1. Buat file di `assets/svg/buildings/` dengan `viewBox="0 0 160 240"` (atau ukuran lain).
   Titik dasar bangunan untuk aset 160×240 berada di `(80, 208)`.
2. Daftarkan aset di `GAME.SVG_ASSETS` (`js/svgassets.js`): `src`, `w`, `h`, `ax`, `ay`,
   serta opsional `lights`, `fountain`, `crown`, dan `stars`.
3. Tambah entri di `GAME.BUILDINGS` (`js/data.js`) dengan `sprite:'nama_aset'`, biaya,
   manfaat, dan `unlockCh`. Untuk bangunan air (marina/jembatan), tambahkan `onWater:true`.
4. Muat ulang game. Preview menu Bangun, penempatan, upgrade, lampu malam, dan save
   akan otomatis memakai aset baru.

Menu Bangun menampilkan preview, nama, biaya, manfaat, kebutuhan lahan (1 petak darat/air),
tombol **Bangun**, serta tombol **Batal** di dalam modal dan di peta. Saat bangunan air
dipilih, panduan otomatis berubah menjadi “Ketuk petak air kosong…”.

### Catatan teknologi

Repositori ini adalah game browser **HTML5 Canvas + JavaScript**, bukan proyek Godot 4.x.
Karena itu integrasi SVG dilakukan langsung ke renderer canvas yang sudah ada, bukan
melalui import scene Godot. Pendekatan ini mempertahankan seluruh gameplay lama dan tetap
berjalan di PC maupun HP melalui browser.

### Batasan / catatan tersisa

- Menara tinggi (**Menara Nusantara, Hotel Bintang Laut, Menara Perkantoran,
  Apartemen Mewah, Bursa Nusantara**) wajib berjarak minimal 1 petak dari menara lain.
  Petak yang terlalu dekat ditandai merah dan pesan bantuan muncul; ini menjaga siluet
  isometrik tetap terbaca. Bangunan rendah tetap boleh berdempetan.
- Save lama yang telanjur memiliki menara berdempetan tetap dapat dimuat. Setiap menara
  kini memiliki **rim cahaya hangat** di tepi siluetnya sehingga batas antar-gedung
  tetap terlihat tanpa mengubah data save.
- 15 bangunan lain (bukan landmark) masih memakai sprite prosedural lama; semuanya tetap
  berfungsi normal dan tidak menghalangi pemakaian aset SVG baru.
- Marina dan jembatan menempati satu petak air; peta memiliki area air kecil, jadi kedua
  bangunan ini sebaiknya tidak dibangun berdempetan.

## Verifikasi

- **22/22 aset SVG dimuat** tanpa 404 maupun error konsol: 16 gedung + 6 dekorasi.
- **5 rim menara** (skyscraper, hotel, kantor kaca, apartemen, bursa) berhasil dibuat
  otomatis saat aset dimuat.
- Uji aturan jarak: menara pada petak yang bersebelahan dengan menara lain ditolak,
  kas tidak berkurang, petak tetap kosong, dan pesan penjelasan muncul.
- Playwright 1440×900 (Chromium headless): seluruh 12 gedung wajib beserta Marina,
  Taman Kota, dan 3 dekorasi baru lolos uji `tryPlace`; 22 bangunan dan 50 petak jalan
  tampil di peta; 18 bangunan sempat berstatus konstruksi lalu selesai.
- Menu Bangun menampilkan 34 kartu; preview SVG (termasuk Air Mancur Megah) ter-render,
  kartu dapat diklik, dan panduan penempatan muncul. Info bangunan, upgrade, serta
  penghapusan tetap berfungsi.
- Ekonomi lama berjalan: satu periode menambah pendapatan, kas, dan bulan; simulasi
  warga, kendaraan, siang–malam, lampu jendela, lampu jalan, dan air mancur aktif.
- Tangkapan layar siang & malam (termasuk close-up menara) menunjukkan skyline, rim
  pemisah siluet, bayangan gedung, refleksi kaca, lampu malam, palem, lampu jalan, dan
  dekorasi air tanpa error konsol maupun permintaan aset yang gagal.
- Uji regresi lama (story save/load, kuis, challenge, audio, mobile) tidak diubah oleh
  pekerjaan visual ini dan tetap menggunakan jalur kode yang sama.

## Struktur

```
index.html          — halaman & layar game
css/style.css       — gaya UI kartun responsif
assets/svg/buildings/ — 16 aset SVG gedung isometrik yang dapat diedit
assets/svg/decorations/ — 6 aset SVG dekorasi (palem, lampu, jalan, plaza, air mancur, kolam)
js/data.js          — konfigurasi bangunan, barang, bab, kuis, ensiklopedia, pencapaian
js/sprites.js       — sprite prosedural, petak, palem, lampu jalan
js/svgassets.js     — manifest & loader SVG, cache level, overlay lampu/level
js/state.js         — state permainan + save/load
js/economy.js       — mesin simulasi periode
js/render.js        — renderer canvas isometrik + kamera
js/audio.js         — SFX & musik WebAudio (tanpa file eksternal)
js/story.js         — dialog, alur 7 bab, kuis
js/ui.js            — HUD, panel, modal, grafik, preview bangunan
js/main.js          — input, loop, wiring
```

Semua angka ekonomi adalah nilai simulasi untuk pembelajaran, bukan data nyata.
