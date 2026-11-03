# GAME DESIGN DOCUMENT (GDD)
# PRESIDENT OF ECONOMY

**Versi:** 1.0  
**Genre:** 2D City Building, Simulasi Ekonomi, Strategi, Edukasi  
**Platform:** PC dan HP melalui browser  
**Game Engine:** Godot 4.x  
**Target Pemain:** Pelajar SMA/SMK dan pemain umum yang ingin belajar ekonomi  
**Mode Permainan:** Story Mode, Free Build, dan Challenge Mode  
**Gaya Visual:** Kartun berwarna dengan tampilan kota isometrik 2D

---

# 1. KONSEP UTAMA

President of Economy adalah game simulasi pembangunan negara. Pemain berperan sebagai presiden sebuah negara fiktif bernama Nusantara Raya yang harus mengembangkan kota, mengatur anggaran negara, membangun industri, mengatasi masalah ekonomi, dan meningkatkan kesejahteraan masyarakat.

Pemain tidak hanya membangun kota, tetapi juga mempelajari bagaimana keputusan ekonomi memengaruhi kehidupan masyarakat.

Contohnya:
- Membangun pabrik dapat membuka lapangan kerja, tetapi membutuhkan biaya dan bahan baku.
- Membangun pertanian dapat meningkatkan persediaan pangan.
- Memberikan subsidi dapat membantu masyarakat, tetapi mengurangi anggaran negara.
- Menetapkan harga terlalu tinggi dapat membuat barang sulit terjual.
- Meningkatnya permintaan ketika persediaan terbatas dapat menyebabkan kenaikan harga.
- Mengatur pajak dapat meningkatkan pendapatan negara, tetapi kebijakan yang kurang tepat bisa membebani masyarakat.

**Tujuan utama:** membangun negara yang makmur, stabil, produktif, dan memiliki masyarakat yang sejahtera.

# 2. LATAR BELAKANG CERITA

Nusantara Raya merupakan negara yang baru mengalami pergantian pemerintahan. Negara ini mempunyai sumber daya alam yang melimpah, penduduk yang kreatif, dan peluang perdagangan yang besar.

Namun, negara sedang menghadapi beberapa masalah:
- Harga kebutuhan pokok tidak stabil.
- Banyak penduduk belum mendapatkan pekerjaan.
- Produksi pangan belum mencukupi kebutuhan.
- Infrastruktur belum merata.
- Anggaran negara terbatas.
- Beberapa wilayah belum memiliki sekolah dan fasilitas kesehatan yang memadai.

Pemain terpilih menjadi presiden baru dan diberikan tanggung jawab untuk memperbaiki keadaan tersebut.

Pada awal permainan, pemain hanya memiliki kota kecil dengan beberapa bangunan, lahan kosong, dan anggaran terbatas. Seiring berjalannya waktu, pemain akan mengembangkan kota menjadi pusat perdagangan dan industri, kemudian membangun negara yang kuat.

Setiap keputusan akan memengaruhi perkembangan negara.

# 3. VISI DAN TUJUAN GAME

## Visi

Menciptakan game edukasi yang membuat pemain memahami ekonomi melalui pengalaman bermain, bukan hanya melalui membaca teori.

## Tujuan pemain

1. Mengembangkan kota dan infrastruktur.
2. Mengelola anggaran negara.
3. Memahami permintaan dan penawaran.
4. Menjaga keseimbangan pasar.
5. Mengendalikan inflasi.
6. Meningkatkan kesempatan kerja.
7. Mengembangkan produksi dan perdagangan.
8. Meningkatkan pendidikan, kesehatan, dan kesejahteraan.
9. Menyelesaikan krisis ekonomi.
10. Menyelesaikan seluruh babak cerita dan membangun negara yang berkelanjutan.

# 4. TARGET PEMAIN

Game dirancang untuk:
- Pelajar SMA/SMK yang mempelajari ekonomi.
- Pemain yang menyukai pembangunan kota.
- Pemain yang menyukai strategi dan pengelolaan sumber daya.
- Pemain pemula yang ingin memainkan game simulasi dengan aturan sederhana.

Materi ekonomi disampaikan melalui kejadian dalam game, percakapan karakter, misi, dan penjelasan singkat.

Pemain tidak harus memahami ekonomi terlebih dahulu untuk mulai bermain.

# 5. GAYA VISUAL DAN DUNIA GAME

## Tampilan kota

Game menggunakan gaya 2D isometrik, yaitu bangunan dan lingkungan terlihat dari sudut miring sehingga kota tampak memiliki kedalaman.

Kota terdiri dari petak-petak lahan. Pemain dapat memilih lahan, membangun bangunan, meningkatkan bangunan, dan mengembangkan wilayah.

Gaya visual:
- Kartun dengan warna cerah.
- Bangunan mudah dibedakan.
- Jalan dan lahan terlihat jelas.
- Pepohonan dan dekorasi membuat kota terasa hidup.
- Antarmuka sederhana dan mudah dipahami.
- Animasi ringan agar nyaman dimainkan di HP.

## Perkembangan kota

Kota berkembang melalui beberapa tahap:

**Tahap 1 — Kota Kecil:** kantor pemerintahan, pasar, pertanian, dan rumah warga.

**Tahap 2 — Kota Berkembang:** sekolah, rumah sakit, pabrik, dan jalan yang lebih baik.

**Tahap 3 — Kota Industri:** gudang, pusat perdagangan, transportasi, dan kawasan industri.

**Tahap 4 — Kota Modern:** pusat bisnis, fasilitas publik lengkap, dan jaringan produksi yang lebih efisien.

Perkembangan visual harus mencerminkan kemajuan ekonomi negara.

# 6. KARAKTER UTAMA

## 6.1 Presiden

Tokoh yang dikendalikan pemain melalui menu dan keputusan strategis.

Tugasnya adalah menentukan arah pembangunan, menetapkan kebijakan, menyelesaikan misi, dan mengatasi masalah negara.

## 6.2 Menteri Ekonomi

Penasihat utama pemain yang menjelaskan keadaan ekonomi dan memberikan saran.

Contoh dialog:

“Pak Presiden, persediaan beras mulai menurun sementara permintaan masyarakat meningkat. Kita dapat meningkatkan produksi pertanian atau mendatangkan beras dari wilayah lain.”

Menteri tidak selalu memberikan jawaban langsung. Pemain tetap harus menentukan kebijakan yang paling sesuai.

## 6.3 Pak Budi — Petani

Menjelaskan produksi pertanian, biaya produksi, hasil panen, dan persediaan pangan.

Contoh dialog:

“Pak Presiden, lahan kita cukup luas, tetapi produksi masih rendah karena fasilitas pertanian belum memadai.”

## 6.4 Bu Rina — Pedagang

Menjelaskan harga, permintaan, penawaran, dan perdagangan.

Contoh dialog:

“Ketika banyak pembeli mencari beras tetapi stok di pasar sedikit, harga biasanya meningkat.”

## 6.5 Kepala Daerah

Melaporkan kondisi wilayah, kebutuhan masyarakat, pembangunan, dan permasalahan lokal.

## 6.6 Warga Negara

Warga memiliki kebutuhan seperti pangan, pekerjaan, pendidikan, kesehatan, dan tempat tinggal.

Kondisi warga berubah sesuai keputusan pemain. Jika kebutuhan terpenuhi, kesejahteraan meningkat. Jika pengangguran atau harga kebutuhan pokok meningkat, kepuasan masyarakat dapat menurun.

# 7. MEKANISME PERMAINAN UTAMA

Permainan menggunakan siklus waktu. Satu periode permainan mewakili satu bulan simulasi.

Pada setiap periode, pemain dapat:

1. Melihat laporan kondisi negara.
2. Memeriksa pendapatan dan pengeluaran.
3. Membangun atau meningkatkan bangunan.
4. Mengatur kebijakan ekonomi.
5. Memeriksa harga dan persediaan barang.
6. Menjalankan misi.
7. Mengakhiri periode untuk memperbarui simulasi ekonomi.

Ketika pemain mengakhiri periode, game menghitung perubahan uang, produksi, persediaan barang, harga, pekerjaan, dan kesejahteraan.

Pemain kemudian menerima laporan hasil keputusan.

Contoh laporan:

- Pendapatan negara: meningkat.
- Produksi pangan: meningkat.
- Pengangguran: menurun.
- Persediaan beras: cukup.
- Anggaran: surplus.

Hasil ini bergantung pada kondisi kota dan kebijakan yang dipilih.

# 8. SISTEM PEMBANGUNAN KOTA

Pemain membangun kota menggunakan lahan yang tersedia.

## 8.1 Cara membangun

1. Pemain menekan tombol **Bangun**.
2. Game menampilkan daftar bangunan.
3. Pemain memilih bangunan.
4. Pemain memilih lahan kosong.
5. Game menampilkan biaya pembangunan.
6. Pemain mengonfirmasi pembangunan.
7. Bangunan muncul di kota dan mulai berfungsi setelah selesai dibangun.

Jika uang tidak cukup atau lahan tidak memenuhi syarat, game menampilkan penjelasan.

## 8.2 Daftar bangunan

### Pemerintahan dan keuangan
- Kantor pemerintahan.
- Balai kota.
- Bank.
- Kantor perusahaan.

### Perdagangan
- Pasar tradisional.
- Pusat perbelanjaan.
- Gudang logistik.
- Pelabuhan.
- Bandara.

### Produksi
- Lahan pertanian.
- Perkebunan.
- Peternakan.
- Perikanan budidaya.
- Pabrik.
- Pertambangan.

### Pelayanan masyarakat
- Sekolah.
- Rumah sakit.
- Puskesmas.
- Perumahan.

### Infrastruktur dan lingkungan
- Jalan.
- Jembatan.
- Pembangkit listrik.
- Instalasi pengolahan air.
- Tempat pengelolaan sampah.
- Taman kota.

Setiap bangunan memiliki fungsi, biaya pembangunan, biaya operasional, dan pengaruh terhadap ekonomi.

## 8.3 Peningkatan bangunan

Bangunan dapat ditingkatkan ke level berikutnya.

Contoh:
- Pertanian level 1 menghasilkan 100 unit pangan per periode.
- Pertanian level 2 menghasilkan lebih banyak pangan.
- Pertanian level 3 memiliki kapasitas produksi lebih tinggi dan dapat membutuhkan lebih banyak biaya operasional.

Angka tersebut merupakan contoh awal untuk pengujian game dan dapat disesuaikan selama pengembangan.

# 9. SISTEM EKONOMI NEGARA

## 9.1 Anggaran negara

Pemain mengelola uang negara yang digunakan untuk pembangunan, pelayanan publik, subsidi, dan operasional.

Contoh nilai awal untuk prototipe:
- Kas awal: Rp100 miliar.
- Pendapatan dasar per periode: Rp10 miliar.
- Pengeluaran operasional dasar: Rp8 miliar.

Angka tersebut adalah nilai simulasi, bukan data ekonomi negara nyata.

Rumus dasar:

**Saldo akhir = saldo awal + total pendapatan − total pengeluaran.**

Jika pendapatan lebih besar daripada pengeluaran, negara mengalami surplus pada periode tersebut.

Jika pengeluaran lebih besar daripada pendapatan, negara mengalami defisit pada periode tersebut.

Defisit tidak otomatis membuat game berakhir. Namun, defisit yang berlangsung lama dapat mengurangi kemampuan pembangunan dan meningkatkan risiko krisis.

## 9.2 Sumber pendapatan

- Pajak.
- Aktivitas perdagangan.
- Pendapatan dari perusahaan milik negara jika fitur tersebut diterapkan.
- Hasil produksi atau ekspor.
- Pendapatan lain yang dibuka melalui misi.

## 9.3 Pengeluaran

- Pembangunan.
- Operasional bangunan.
- Pendidikan.
- Kesehatan.
- Infrastruktur.
- Subsidi.
- Perawatan fasilitas publik.

## 9.4 Sistem pajak

Pemain dapat mengatur tingkat pajak melalui menu kebijakan.

Pajak yang lebih tinggi dapat meningkatkan pendapatan pemerintah, tetapi dapat menekan kemampuan belanja masyarakat atau keuntungan usaha.

Pajak yang lebih rendah dapat membantu aktivitas ekonomi, tetapi mengurangi pendapatan negara.

Pengaruh pajak harus dihitung melalui model simulasi yang sederhana dan konsisten.

## 9.5 Sistem subsidi

Subsidi membantu sektor tertentu, misalnya pertanian atau kebutuhan pokok.

Contoh: subsidi pertanian mengurangi biaya produksi petani sehingga mereka dapat meningkatkan produksi.

Namun, subsidi membutuhkan anggaran. Jika terlalu besar, pengeluaran negara dapat meningkat.

# 10. SISTEM PASAR DAN KESEIMBANGAN PASAR

Materi ini menjadi salah satu fitur edukasi utama.

## 10.1 Permintaan

Permintaan adalah jumlah barang yang ingin dan mampu dibeli konsumen pada tingkat harga tertentu.

Dalam contoh sederhana, ketika harga naik, jumlah yang diminta biasanya turun, dengan faktor lain tetap.

## 10.2 Penawaran

Penawaran adalah jumlah barang yang ingin dan mampu dijual produsen pada tingkat harga tertentu.

Dalam contoh sederhana, ketika harga naik, jumlah yang ditawarkan biasanya meningkat, dengan faktor lain tetap.

## 10.3 Keseimbangan pasar

Keseimbangan pasar terjadi ketika jumlah yang diminta sama dengan jumlah yang ditawarkan.

Contoh pasar beras:

| Harga per unit | Permintaan | Penawaran |
|---|---:|---:|
| Rp8.000 | 100 | 40 |
| Rp10.000 | 80 | 60 |
| Rp12.000 | 60 | 60 |
| Rp14.000 | 40 | 80 |

Dalam contoh ini, keseimbangan terjadi pada harga Rp12.000 karena permintaan dan penawaran sama-sama berjumlah 60 unit.

Nilai tersebut adalah contoh pembelajaran, bukan prediksi harga beras sebenarnya.

## 10.4 Cara pemain mempelajarinya

Pemain membuka pasar dan melihat:
- Harga barang.
- Stok barang.
- Permintaan masyarakat.
- Jumlah barang yang diproduksi.
- Jumlah barang yang terjual.

Pemain dapat mengambil keputusan seperti meningkatkan produksi, membangun fasilitas baru, atau mengatur kebijakan perdagangan.

Setelah periode berakhir, game memperlihatkan dampak keputusan tersebut.

Jika persediaan kurang, harga dapat naik. Jika persediaan terlalu banyak dan permintaan rendah, barang dapat menumpuk dan harga dapat turun.

Game perlu menjelaskan bahwa hubungan tersebut merupakan model sederhana. Dalam ekonomi nyata, harga juga dipengaruhi faktor lain.

# 11. SISTEM PRODUKSI DAN PERDAGANGAN

Setiap sektor ekonomi memiliki hubungan satu sama lain.

Contoh rantai produksi:

**Pertanian → Gudang → Pasar → Konsumen.**

1. Pertanian menghasilkan beras.
2. Gudang menyimpan persediaan.
3. Pasar menjual beras.
4. Warga membeli beras.
5. Persediaan berkurang sesuai jumlah penjualan.

Contoh rantai industri:

**Pertanian → Bahan baku → Pabrik → Produk → Pasar.**

Pemain perlu memperhatikan kapasitas produksi, biaya, stok, dan kebutuhan masyarakat.

Jika produksi meningkat tetapi tidak ada permintaan, stok dapat menumpuk.

Jika permintaan meningkat sementara produksi terbatas, barang dapat mengalami kelangkaan.

# 12. SISTEM PEKERJAAN DAN PENGANGGURAN

Bangunan tertentu menyediakan lapangan kerja.

Contoh:
- Pertanian membutuhkan petani.
- Pabrik membutuhkan pekerja.
- Pasar membutuhkan pedagang dan pegawai.
- Sekolah membutuhkan tenaga pendidik.
- Rumah sakit membutuhkan tenaga kesehatan.

Ketika pemain membangun fasilitas usaha, kesempatan kerja dapat meningkat.

Namun, pekerjaan tidak boleh hanya dihitung dari jumlah bangunan. Sistem simulasi juga perlu memperhitungkan jumlah penduduk, kebutuhan pekerja, kapasitas usaha, dan ketersediaan anggaran.

Pemain dapat membuka menu tenaga kerja untuk melihat:
- Jumlah penduduk.
- Jumlah penduduk yang bekerja.
- Jumlah pencari kerja.
- Tingkat pengangguran.
- Sektor yang membutuhkan pekerja.

# 13. INDIKATOR KEBERHASILAN NEGARA

Dashboard utama menampilkan indikator berikut:

1. **Kas negara:** uang yang tersedia.
2. **Pendapatan:** uang yang diterima setiap periode.
3. **Pengeluaran:** uang yang digunakan setiap periode.
4. **Inflasi:** ukuran kenaikan harga secara umum dalam simulasi.
5. **Pengangguran:** bagian angkatan kerja yang belum bekerja dalam model game.
6. **Kesejahteraan:** ukuran gabungan dari kondisi kebutuhan masyarakat.
7. **Ketersediaan pangan:** kecukupan persediaan kebutuhan pokok.
8. **Pertumbuhan ekonomi:** perubahan aktivitas produksi atau ekonomi dalam periode tertentu.

Indikator ditampilkan menggunakan angka, grafik sederhana, dan warna yang mudah dipahami.

Pemain tidak harus membuat semua indikator sempurna sekaligus. Keputusan yang baik biasanya membutuhkan keseimbangan antara beberapa tujuan.

# 14. SISTEM INFLASI DAN KRISIS

## 14.1 Inflasi

Inflasi dalam game menggambarkan kenaikan harga barang secara umum.

Contoh penyebab dalam simulasi:
- Persediaan kebutuhan pokok berkurang.
- Biaya produksi meningkat.
- Permintaan meningkat lebih cepat daripada produksi.
- Gangguan distribusi membuat barang sulit mencapai pasar.

Solusi yang mungkin dilakukan:
- Meningkatkan produksi.
- Memperbaiki distribusi.
- Mengurangi hambatan pasokan.
- Memberikan subsidi secara terukur.
- Menyesuaikan kebijakan ekonomi.

Pemain harus memahami bahwa satu kebijakan tidak selalu menyelesaikan semua penyebab inflasi.

## 14.2 Krisis pangan

Stok pangan menurun dan warga mulai kesulitan memperoleh kebutuhan pokok.

Pemain harus memilih cara meningkatkan pasokan, memperbaiki distribusi, atau mendatangkan barang dari wilayah lain.

## 14.3 Krisis pengangguran

Banyak warga belum mendapatkan pekerjaan.

Pemain dapat mengembangkan sektor produksi, membangun fasilitas usaha, dan meningkatkan keterampilan masyarakat melalui pendidikan.

## 14.4 Krisis anggaran

Pengeluaran negara melebihi pendapatan selama beberapa periode.

Pemain perlu memeriksa anggaran, menentukan prioritas, dan memperbaiki pendapatan atau mengendalikan pengeluaran.

## 14.5 Bencana dan gangguan distribusi

Banjir atau gangguan transportasi dapat menghambat produksi dan distribusi.

Pemain dapat membangun infrastruktur, menyediakan dana darurat, dan mengatur pemulihan wilayah.

# 15. STORY MODE DAN MISI UTAMA

Story Mode terdiri dari tujuh bab yang harus diselesaikan secara berurutan.

## Bab 1 — Negara yang Baru Dimulai

**Cerita:** Pemain baru dilantik sebagai presiden dan menerima laporan kondisi negara.

**Misi:**
- Mengenal dashboard.
- Membangun pasar.
- Mengembangkan lahan pertanian.
- Memeriksa anggaran.
- Mengakhiri periode pertama.

**Materi:** dasar pembangunan dan pengelolaan uang.

**Hadiah:** akses ke fitur ekonomi dan pembangunan dasar.

## Bab 2 — Harga yang Tidak Stabil

**Cerita:** Harga beras berubah karena stok dan kebutuhan masyarakat tidak seimbang.

**Misi:**
- Memeriksa stok beras.
- Melihat data permintaan dan penawaran.
- Memilih tindakan untuk menambah pasokan.
- Mencapai kondisi pasar yang lebih stabil.

**Materi:** permintaan, penawaran, dan keseimbangan pasar.

**Hadiah:** akses ke analisis pasar.

## Bab 3 — Pabrik dan Lapangan Kerja

**Cerita:** Pengangguran meningkat karena kesempatan kerja terbatas.

**Misi:**
- Membangun atau meningkatkan fasilitas produksi.
- Menyediakan lapangan kerja.
- Menjaga biaya operasional.
- Memantau perubahan pengangguran.

**Materi:** produksi, biaya, dan tenaga kerja.

**Hadiah:** bangunan industri dan gudang.

## Bab 4 — Mengatasi Inflasi

**Cerita:** Harga sejumlah kebutuhan pokok meningkat.

**Misi:**
- Memeriksa harga beberapa barang.
- Mencari penyebab kenaikan harga.
- Menentukan kebijakan yang sesuai.
- Menstabilkan kondisi pasar.

**Materi:** inflasi, pasokan, dan kebijakan ekonomi.

**Hadiah:** fitur kebijakan lanjutan.

## Bab 5 — Negara untuk Semua

**Cerita:** Pembangunan ekonomi mulai berkembang, tetapi beberapa wilayah masih kekurangan pelayanan publik.

**Misi:**
- Membangun sekolah.
- Membangun fasilitas kesehatan.
- Meningkatkan akses jalan.
- Memperbaiki indikator kesejahteraan.

**Materi:** pembangunan manusia dan pemerataan.

**Hadiah:** bangunan pelayanan publik lanjutan.

## Bab 6 — Anggaran dalam Bahaya

**Cerita:** Pengeluaran meningkat sementara pendapatan negara melemah.

**Misi:**
- Membaca laporan anggaran.
- Membedakan pendapatan dan pengeluaran.
- Menyesuaikan kebijakan pajak atau subsidi.
- Memperbaiki kondisi anggaran.

**Materi:** anggaran negara, surplus, dan defisit.

**Hadiah:** fitur laporan keuangan lanjutan.

## Bab 7 — Masa Depan Nusantara Raya

**Cerita:** Negara menghadapi tantangan yang menggabungkan masalah pangan, pekerjaan, harga, dan anggaran.

**Misi:**
- Menjaga stok kebutuhan pokok.
- Menekan pengangguran.
- Menjaga inflasi dalam batas sasaran skenario.
- Memastikan anggaran dapat dikelola.
- Meningkatkan kesejahteraan masyarakat.

**Materi:** penerapan gabungan seluruh konsep ekonomi.

**Hadiah:** gelar Presiden Ekonomi dan akses ke Challenge Mode.

# 16. SISTEM MISI TAMBAHAN

Selain misi cerita, game memiliki misi sampingan yang dapat dikerjakan kapan saja jika syaratnya terpenuhi.

Contoh:

- **Petani Sejahtera:** tingkatkan kapasitas produksi pangan.
- **Kota Produktif:** tambah kesempatan kerja.
- **Pasar Stabil:** capai kondisi keseimbangan pasar dalam skenario tertentu.
- **Anggaran Sehat:** pertahankan anggaran tanpa defisit selama beberapa periode.
- **Pendidikan untuk Semua:** bangun sekolah dan tingkatkan akses pendidikan.
- **Lingkungan Bersih:** sediakan fasilitas pengelolaan sampah.

Misi memiliki tingkat kesulitan dan hadiah yang berbeda.

# 17. SISTEM PENCAPAIAN

Pencapaian memberikan tujuan jangka panjang di luar misi utama.

Contoh pencapaian:

**Pendiri Nusantara**
- Syarat: selesaikan tahap pembangunan awal.

**Ahli Keseimbangan**
- Syarat: selesaikan beberapa tantangan permintaan dan penawaran.

**Penjaga Anggaran**
- Syarat: pertahankan anggaran sesuai target selama sejumlah periode.

**Penyelamat Pangan**
- Syarat: pulihkan stok pangan setelah krisis.

**Negara Produktif**
- Syarat: capai target produksi dan kesempatan kerja.

**Presiden Visioner**
- Syarat: selesaikan Story Mode.

Setiap pencapaian memiliki ikon, nama, deskripsi, dan hadiah seperti uang simulasi atau dekorasi kota.

Tantangan dapat dinilai dengan peringkat perunggu, perak, dan emas berdasarkan hasil pemain.

# 18. FREE BUILD DAN CHALLENGE MODE

## Free Build

Pemain membangun kota tanpa mengikuti cerita utama.

Fitur:
- Membangun bangunan yang telah terbuka.
- Mengembangkan kota sesuai strategi.
- Mengelola anggaran dan produksi.
- Menguji kebijakan.
- Menikmati permainan tanpa tekanan misi cerita.

Mode ini cocok untuk pemain yang ingin bereksperimen.

## Challenge Mode

Pemain menghadapi skenario dengan kondisi awal dan tujuan khusus.

Contoh:
- Pulihkan kota yang mengalami krisis pangan.
- Turunkan pengangguran dalam sejumlah periode.
- Kelola anggaran dengan dana terbatas.
- Stabilkan pasar setelah gangguan distribusi.

Setiap tantangan memiliki kondisi kemenangan dan batasan yang jelas.

# 19. SISTEM EDUKASI INTERAKTIF

Materi tidak hanya diberikan melalui teks panjang.

Game menggunakan tiga metode.

## 19.1 Dialog karakter

Karakter menjelaskan kejadian dan memberi arahan saat pemain menghadapi masalah.

Contoh:

Menteri Ekonomi: “Pak Presiden, permintaan beras meningkat, tetapi produksi kita belum bertambah.”

Pemain kemudian diminta memeriksa pasar dan memilih tindakan.

## 19.2 Kuis

Setelah materi dipelajari, pemain dapat menjawab pertanyaan pilihan ganda.

Contoh:

“Jika permintaan beras meningkat sementara penawaran tetap, apa yang mungkin terjadi pada harga?”

Pilihan:
- A. Harga selalu turun.
- B. Harga dapat meningkat.
- C. Harga pasti tidak berubah.

Jawaban yang benar adalah B dalam kondisi sederhana dengan faktor lain tetap.

## 19.3 Ensiklopedia ekonomi

Menu Ensiklopedia memuat penjelasan singkat mengenai:
- Permintaan dan penawaran.
- Keseimbangan pasar.
- Inflasi.
- Pengangguran.
- Produksi.
- Biaya produksi.
- Pajak.
- Subsidi.
- Pendapatan dan pengeluaran negara.
- Surplus dan defisit.
- Pertumbuhan ekonomi.
- Kesejahteraan masyarakat.

Pemain dapat membuka kembali materi kapan saja.

# 20. SISTEM UI DAN MENU GAME

## 20.1 Main Menu

Saat game dibuka, pemain melihat halaman utama terlebih dahulu.

Isi menu:
- Mulai Game.
- Lanjutkan.
- Pilih Mode.
- Ensiklopedia.
- Pengaturan.
- Kredit.

## 20.2 Dashboard negara

Menampilkan:
- Nama negara.
- Kas negara.
- Pendapatan.
- Pengeluaran.
- Inflasi.
- Pengangguran.
- Kesejahteraan.
- Periode dan tahun simulasi.

## 20.3 Tampilan kota

Bagian utama layar menampilkan peta kota isometrik.

Di bagian bawah tersedia tombol:
- Bangun.
- Ekonomi.
- Kebijakan.
- Misi.
- Ensiklopedia.
- Jeda.

Saat pemain memilih bangunan, panel informasi muncul dengan biaya, fungsi, kapasitas, level, dan tombol peningkatan.

## 20.4 Menu ekonomi

Menampilkan:
- Laporan anggaran.
- Harga barang.
- Stok.
- Produksi.
- Permintaan dan penawaran.
- Tenaga kerja.
- Grafik perkembangan indikator.

## 20.5 Menu misi

Menampilkan misi aktif, syarat penyelesaian, hadiah, dan kemajuan pemain.

## 20.6 Menu jeda

Berisi:
- Lanjutkan.
- Simpan.
- Pengaturan.
- Kembali ke menu utama.

# 21. KONTROL PC DAN HP

## PC

- Klik mouse untuk memilih menu, lahan, dan bangunan.
- Klik tombol Bangun untuk memilih objek.
- Klik lahan untuk menempatkan bangunan.
- Gunakan kontrol kamera yang sederhana jika fitur pergerakan kamera tersedia.

## HP

- Ketuk tombol untuk membuka menu.
- Ketuk lahan untuk memilih lokasi pembangunan.
- Ketuk bangunan untuk melihat informasi.
- Gunakan tombol perbesar dan perkecil peta jika diperlukan.

Ukuran tombol harus cukup besar agar mudah digunakan pada layar sentuh.

# 22. SISTEM SIMPANAN

Game harus dapat menyimpan:
- Progres Story Mode.
- Bangunan yang sudah dibuat.
- Uang negara.
- Persediaan barang.
- Kondisi ekonomi.
- Misi dan pencapaian.
- Pengaturan pemain.

Untuk versi awal, penyimpanan dapat menggunakan penyimpanan lokal browser atau mekanisme penyimpanan Godot yang sesuai dengan platform.

Data lokal pada PC dan HP tidak otomatis tersinkronisasi. Sinkronisasi antarperangkat memerlukan sistem akun dan penyimpanan daring yang ditambahkan kemudian.

# 23. AUDIO DAN EFEK VISUAL

Audio:
- Musik latar kota yang santai.
- Efek tombol.
- Suara saat bangunan selesai.
- Efek ketika misi berhasil.
- Efek peringatan ketika terjadi krisis.

Efek visual:
- Animasi bangunan selesai dibangun.
- Indikator uang bertambah atau berkurang.
- Ikon peringatan krisis.
- Perubahan warna indikator ekonomi.
- Animasi sederhana kendaraan dan aktivitas bangunan jika memungkinkan.

Audio harus dapat dimatikan melalui pengaturan.

# 24. TEKNOLOGI DAN STRUKTUR PEMBUATAN

## Engine

Godot 4.x dengan GDScript.

## Platform

Target awal adalah game 2D yang dapat diekspor ke Web/HTML5 dan dimainkan melalui browser yang kompatibel.

Satu tautan web dapat digunakan untuk mengakses game di PC dan HP, tetapi hasil ekspor web harus diuji pada perangkat serta browser sasaran.

## Struktur proyek yang disarankan

- `scenes/` — berisi scene menu, kota, bangunan, dan dialog.
- `scripts/` — berisi kode ekonomi, pembangunan, misi, dan penyimpanan.
- `assets/buildings/` — berisi aset bangunan.
- `assets/characters/` — berisi aset karakter.
- `assets/tiles/` — berisi aset tanah, jalan, dan lingkungan.
- `assets/ui/` — berisi ikon dan elemen antarmuka.
- `assets/audio/` — berisi musik dan efek suara.
- `data/` — berisi konfigurasi bangunan, barang, misi, dan materi edukasi.

Struktur ini dapat disesuaikan dengan kebutuhan proyek.

# 25. RENCANA PENGEMBANGAN BERTAHAP

Game sebaiknya tidak dibuat sekaligus karena sistem pembangunan dan ekonomi saling berhubungan.

## Tahap 1 — Fondasi

- Membuat proyek Godot.
- Membuat Main Menu.
- Membuat peta isometrik.
- Membuat sistem memilih lahan.
- Membuat satu bangunan yang dapat ditempatkan.
- Menampilkan uang awal.

## Tahap 2 — Sistem Bangunan

- Menambahkan beberapa jenis bangunan.
- Mengatur biaya pembangunan.
- Menampilkan informasi bangunan.
- Menambahkan peningkatan bangunan.
- Menyimpan bangunan yang telah dibuat.

## Tahap 3 — Sistem Ekonomi

- Menambahkan pendapatan dan pengeluaran.
- Membuat sistem pergantian periode.
- Menambahkan produksi dan stok.
- Membuat harga barang.
- Membuat permintaan dan penawaran.

## Tahap 4 — Story Mode

- Menambahkan karakter penasihat.
- Membuat dialog.
- Membuat misi.
- Menambahkan kuis.
- Membuat sistem hadiah.

## Tahap 5 — Indikator dan Pencapaian

- Menambahkan inflasi.
- Menambahkan pengangguran.
- Menambahkan kesejahteraan.
- Membuat krisis.
- Menambahkan pencapaian.

## Tahap 6 — Penyempurnaan

- Menyesuaikan tampilan untuk HP.
- Memperbaiki kontrol mouse dan sentuhan.
- Menambahkan audio.
- Menguji penyimpanan.
- Menguji performa.
- Mengekspor game untuk browser.

Setiap tahap harus diuji sebelum melanjutkan ke tahap berikutnya.

# 26. FITUR MINIMUM UNTUK VERSI PERTAMA (MVP)

Agar proyek realistis untuk pemula, versi pertama cukup memiliki:

1. Main Menu.
2. Peta kota isometrik.
3. Sistem membangun bangunan.
4. Lima bangunan awal: kantor pemerintahan, pasar, pertanian, pabrik, dan sekolah.
5. Sistem uang dan biaya pembangunan.
6. Sistem pergantian periode.
7. Produksi dan persediaan pangan sederhana.
8. Harga serta permintaan dan penawaran.
9. Satu misi krisis pangan.
10. Dialog Menteri Ekonomi.
11. Satu kuis ekonomi.
12. Satu sistem pencapaian.
13. Penyimpanan progres.
14. Kontrol PC dan HP.
15. Ekspor ke browser.

Fitur tambahan baru dikembangkan setelah seluruh fungsi minimum berjalan dengan baik.

# 27. KRITERIA KEBERHASILAN

Versi pertama dianggap berhasil apabila:
- Pemain dapat memulai permainan dari Main Menu.
- Pemain dapat memilih lahan dan membangun bangunan.
- Biaya pembangunan mengurangi kas negara dengan benar.
- Produksi dan stok berubah sesuai simulasi.
- Pergantian periode memperbarui laporan ekonomi.
- Pemain dapat menyelesaikan misi pertama.
- Dialog dan kuis dapat digunakan.
- Progres dapat disimpan dan dimuat kembali.
- Kontrol dasar bekerja pada PC dan HP yang didukung.
- Game dapat diakses melalui tautan web setelah dipublikasikan.

# 28. PENGEMBANGAN MASA DEPAN

Setelah versi pertama stabil, fitur berikut dapat ditambahkan:
- Perdagangan antarwilayah.
- Ekspor dan impor.
- Sistem pinjaman dan utang negara.
- Pemilihan kebijakan yang lebih kompleks.
- Bencana alam.
- Hubungan antarwilayah.
- Tantangan ekonomi acak.
- Grafik ekonomi lanjutan.
- Kustomisasi kota.
- Peringkat pencapaian.
- Akun dan sinkronisasi penyimpanan daring.
- Tantangan mingguan.

Fitur ini bukan syarat untuk membuat versi pertama.

# 29. RANGKUMAN AKHIR

President of Economy adalah game simulasi pembangunan negara yang menggabungkan pembangunan kota, pengelolaan anggaran, perdagangan, produksi, dan pembelajaran ekonomi.

Keunikan game terletak pada hubungan antara keputusan pemain dan dampaknya terhadap masyarakat. Pemain tidak hanya membangun gedung, tetapi juga mempelajari bagaimana pasar bekerja, bagaimana harga terbentuk, mengapa pengangguran terjadi, dan bagaimana anggaran dapat dikelola.

**Prinsip pengembangan:** buat permainan dasar yang bisa dimainkan terlebih dahulu, lalu tambahkan sistem ekonomi, misi, karakter, dan fitur lanjutan secara bertahap.

Dengan pendekatan ini, President of Economy dapat berkembang menjadi game edukasi 2D yang menyenangkan, mudah dipahami, dan memiliki materi ekonomi yang bermanfaat.
