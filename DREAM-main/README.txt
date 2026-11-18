DREAM — Website katalog produk

CARA MENJALANKAN
1. Ekstrak ZIP ini.
2. Buka folder DREAM di VS Code.
3. Pastikan index.html, style.css, dan script.js berada dalam folder yang sama.
4. Klik kanan index.html > Open with Live Server (jika ekstensi Live Server tersedia).

FITUR
- Tema gelap hijau-biru.
- Katalog dan pencarian produk.
- Detail produk.
- Galeri foto dan tampilan perbesar (zoom) jika URL foto tersedia.
- Keranjang dengan tambah/kurangi/hapus.
- Keranjang tersimpan di browser menggunakan localStorage.
- Tombol menuju tautan Tokopedia.

PENTING TENTANG FOTO
Link pendek Tokopedia yang diberikan belum bisa dibaca dari sini. Karena itu foto iPhone 18 Pro Max sengaja belum diisi, supaya tidak menampilkan foto model iPhone lain seolah-olah itu iPhone 18 Pro Max.
Saat foto produk yang benar tersedia, masukkan URL gambar langsung ke array images pada produk di script.js. Contoh:
images: ["https://alamat-gambar/foto-utama.jpg", "https://alamat-gambar/foto-samping.jpg"]

PENTING TENTANG CHECKOUT
Keranjang DREAM hanya menyimpan pilihan pengunjung di website ini. Keranjang tersebut tidak otomatis tersambung dengan keranjang Tokopedia. Tombol checkout membuka tautan halaman produk Tokopedia untuk masing-masing produk. Pembayaran dilakukan di Tokopedia.
Harga contoh saat ini mengikuti informasi dari pengguna: Rp24.000.000. Periksa ulang harga dan detail pada halaman Tokopedia sebelum membeli.

CARA MENAMBAH PRODUK
Di script.js, tambahkan objek baru ke dalam array PRODUCTS. Isi id, name, category, price, description, tokopediaUrl, dan images.
