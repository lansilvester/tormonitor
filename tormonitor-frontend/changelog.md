# 📝 Changelog | TorMonitor Frontend

Dokumen ini mencatat seluruh fase pengembangan, penambahan fitur, dan refaktorisasi pada antarmuka pengguna **TorMonitor Frontend**.

---

## 🚀 [0.3.0-dev] - 2026-07-15 (Commit: `bb8b316` | 13:00 WIB)

### ✨ Added
- Card summary di dashboard admin (Total User, Aktif, Freeze/Banned, AUM).
- Fitur registrasi manual via tombol "+ Tambah Pengguna Baru".
- Bulk action (suspend/soft-delete massal) dengan checkbox tabel.
- Refaktor modal edit user jadi layout 2 kolom yang sejajar (symmetrical row grid).
- Pop-up preview dokumen KYC (KTP & Selfie) untuk verifikasi data.
- Server status widget di sidebar khusus tampilan admin.
- Dialog konfirmasi hapus kustom (modal warning soft-delete) menggantikan default alert browser.

### 🔒 Security & Compliance
- Kolom wajib isi alasan perubahan profil untuk audit log (tombol simpan dinonaktifkan jika kosong).
- Penguncian data sensitif (email & nominal portofolio) menjadi read-only bagi admin.
- Tombol aksi cepat untuk reset password & PIN transaksi via email pengguna.

---

## 🔒 [0.2.0] - 2026-07-13 (Commit: `c041c98` | 21:06 WIB)

### ✨ Added
- Halaman login, register, dan forgot password.
- Desain tema warna premium (Forest Green, Cream, Terracotta).

### 🛠️ Changed
- Restrukturisasi folder (`components/layout` dan `pages/auth`).

---

## 🧹 [0.1.1] - 2026-07-13 (Commit: `ccfcffb` | 17:11 WIB)

### 🛠️ Changed
- Bersihkan import & dependensi header file yang tidak terpakai.

---

## 🏗️ [0.1.0] - 2026-07-13 (Commit: `03d7e15` | 17:06 WIB)

### ✨ Added
- Dashboard utama investor dengan grafik pertumbuhan portofolio.
- Daftar kepemilikan aset & persentase alokasinya.
- Form tambah & edit unit aset mandiri.
