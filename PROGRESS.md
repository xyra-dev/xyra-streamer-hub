# Xyra Streamer Hub — Website (GitHub Pages)

Catatan proyek website, dibuat 2026-11-26. Status: **LIVE** di https://xyra-dev.github.io/xyra-streamer-hub/ (rilis pertama).
Proyek terkait: app Android `C:\Dev_Ex\Apps\Android\Xyra - Streamer Hub\PROGRESS.md` (v1.0.2).
Situs lain: `C:\Dev_Ex\Projek\gift-db` (pola statis yang ditiru).

---

## 1. Tujuan

Situs publik untuk app **Xyra Streamer Hub** (Android): salam singkat + branding,
cara pakai berbasis **video YouTube**, dan **download APK** via GitHub Releases.
Bukan tempat dokumentasi lengkap — penjelasan cara pakai sengaja dipindah ke video.

## 2. Keputusan yang sudah dikunci

- **Repo terpisah** dari gift-db: Pages independen, Releases khusus APK, URL bersih.
- **Repo**: `xyra-dev/xyra-streamer-hub`, publik, Pages dari `main` folder `/docs`.
- **Bahasa**: Indonesia; label tombol app tetap Inggris (Start / Stop / Continue).
- **Branding**: Xyra Studio, tema gelap aksen ungu, logo `C:\Dev_Ex\Apps\xyra-logo.png`.
- **Tanpa screenshot app** — semua penjelasan lewat video (keputusan 26/11).
- **Tanpa detail game Roblox** (nama/link tidak disebut di situs).
- **APK tidak pernah di repo** — selalu di GitHub Releases (repo publik → asset bisa diunduh).
- **Sumber data versi**: `docs/data/releases.json` (`latest` + `history`).
- **Video**: `docs/data/video.json`; kosong = kartu "Video segera hadir", nggak ada tombol mati.

## 3. Struktur

```
docs/
├─ index.html          Home: salam singkat, 3 poin fitur, CTA download + video
├─ cara-pakai/         video (lite embed) + ringkasan 5 langkah
├─ download/           kartu versi terbaru + syarat + SHA-256 + langkah install
├─ faq/                troubleshooting teks
├─ changelog/          daftar versi (render dari releases.json)
├─ 404.html
├─ .nojekyll
├─ assets/             style.css, nav enhancement JS, logo.png, favicon-64, apple-touch-icon
└─ data/               releases.json, video.json
```

## 4. Fakta app (untuk isi halaman)

- Package `com.xyra.streamerhub`, versionName 1.0.2, versionCode 3.
- MinSdk 29 (**Android 10+**), targetSdk 35, **arm64-v8a only**, ukuran 29.601.311 B (29,6 MB).
- SHA-256 APK 1.0.2:
  `CBB3D9030E736081DFE2882FFC5403485CEA36E2C2CD3348083D5904D363311C`
- Tanggal file APK (semua 2026-11-25): 1.0.0 19:56 · 1.0.1 20:25 · 1.0.2 20:36.
- Alur: token dari Discord (`/token`, tampil sekali) → install APK (unknown sources +
  Play Protect "Scan app") → izin notifikasi + battery "No restrictions" → tempel token
  → **Start** saat live → sambungkan di game → **Stop** kalau selesai.
- 1.0.0 = build non-minify (45,9 MB) · 1.0.1 = minify pertama (29,6 MB).

## 5. Konvensi teknis (warisan pelajaran gift-db)

- Semua path **relatif** — situs hidup di `https://xyra-dev.github.io/xyra-streamer-hub/`.
- JS **classic script** (`defer`), bukan module. Tanpa `?.` / `??` / `replaceChildren`.
- Navigasi & footer **HTML statis** di tiap halaman (jalan tanpa JS).
- JS hanya untuk: render versi (download/changelog) + video (cara-pakai). Semua
  akses elemen di-guard `if (el)`, `fetch` pakai `cache:'no-store'`, ada fallback statis.
- Aset diberi `?v=` saat berubah (cache Pages ±10 menit).
- Disclaimer di footer: bukan produk resmi TikTok/Roblox, proyek independen Xyra Studio.

## 6. Alur rilis APK baru (wajib urut)

1. Upload APK ke GitHub Releases (`gh release create vX.Y.Z <apk>`).
2. Update `docs/data/releases.json` (pindahkan `latest` lama ke `history`, isi catatan).
3. Bump fallback statis di `download/index.html` & `changelog/index.html` (teks default
   untuk pengunjung tanpa JS) + bump `?v=` kalau HTML berubah.
4. Push → tunggu build Pages → cek halaman download.

## 7. TODO / sisa kerjaan

- [x] Deploy: repo + push + Pages `/docs` aktif (build `1b4c694` "built").
- [x] Release `v1.0.2` + upload `XyraStreamerHub-1.0.2.apk` (asset 200, 29.601.311 B).
- [x] Verifikasi live: 6 halaman HTTP 200; DOM check download (v1.0.2 + SHA + tombol) & cara-pakai.
- [ ] Isi `docs/data/video.json` begitu video YouTube jadi (cukup 1 file, tanpa ubah HTML).
- [ ] (Opsional) custom domain kalau nanti diminta.

## 8. Log

- **2026-11-26** — Proyek dimulai. Aset disiapkan (logo di-resize + favicon; screenshot
  app sempat disiapkan lalu **dibuang** dari scope: keputusan final tanpa gambar).
  SHA-256 & metadata APK terkumpul. File situs ditulis.
- **2026-11-26** — Deploy pertama: repo `xyra-dev/xyra-streamer-hub` publik, commit
  `1b4c694`, Pages "built". Release `v1.0.2` + APK ter-upload dan bisa diunduh.
  Uji lokal & live lolos semua (lihat AGENTS.md untuk konvensi; README.md untuk update).
- **2026-11-26** — Integrasi Katalog Gift (`gift-db`) & In-Game Roblox:
  - Website: link "Katalog Gift" ditambahkan di navbar dan footer semua 5 halaman. Step 5 Cara Pakai & FAQ dilengkapi panduan katalog gift.
  - In-Game Roblox (`ServerStorage.Gz_Streamer`): `GiftCatalog`, `GiftPicker` (hint header "More"), `_README`, dan `_ROADMAP` diperbarui dengan referensi `xyra-dev.github.io/gift-db`. Place disimpan ke cloud (v3913).
  - Katalog Gift (`gift-db`): tampilan diseragamkan total ke tema Xyra Studio (header nav bolak-balik, tema gelap ungu, logo Xyra, footer resmi).
- **2026-11-26** — Redesign UI Modern & Background Pure Black:
  - Redesign visual: sistem obsidian dark `#050508`, mobile navbar smooth scroll pills, aura pendar logo hero, highlights bar (`Tanpa PC`, `WebSocket Realtime`, `±30 MB Ringan`, `Bebas Iklan`), timeline step cards `01`–`05`, dan 1-click copy SHA-256.
  - Sesuai arahan user: seluruh background kartu (`.card`, `.steps li`, `.download-card`, `.release`, `.faq details`, `.controls-card`) diubah menjadi pure hitam pekat (`#000000`) tanpa semu ungu agar lebih tajam dan bersih.
  - Cache Pages di-bump ke `style.css?v=3` (hub) dan `style.css?v=8` (gift-db). Status Pages: `built`.
