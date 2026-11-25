# AGENTS.md — Xyra Streamer Hub (website)

Catatan untuk AI/agent berikutnya. Proyek induk app:
`C:\Dev_Ex\Apps\Android\Xyra - Streamer Hub\PROGRESS.md`.

## Fakta repo

- Repo publik: `xyra-dev/xyra-streamer-hub`, remote `origin`, branch `main`.
- Pages: branch `main`, folder `/docs` — URL `https://xyra-dev.github.io/xyra-streamer-hub/`.
- Statis murni, tanpa build step, tanpa dependency npm. `.nojekyll` wajib ada di `docs/`.
- Preview lokal: `python -m http.server 4321 --directory docs` (bind 127.0.0.1).
- Verifikasi sebelum push: `node --check docs/assets/app.js`.

## Keputusan desain (jangan dibalik tanpa alasan)

- **Bahasa Indonesia**, label tombol app tetap Inggris (Start/Stop/Continue).
- **Tema gelap aksen ungu** (Xyra Studio). Logo: `docs/assets/logo.png` (dari
  `C:\Dev_Ex\Apps\xyra-logo.png`, tampil di atas tile putih — PNG aslinya background putih,
  jangan dipaksa transparan karena garis X-nya putih).
- **Tanpa screenshot app** — semua penjelasan lewat video (keputusan 26/11/2026).
- **Tanpa nama/link game Roblox** di konten situs; cukup "game" secara umum.
- **Tidak ada link Discord** di situs (belum ada invite resmi); cukup sebut "Discord Xyra" teks.
- Disclaimer footer wajib di semua halaman: proyek independen, bukan afiliasi TikTok/Roblox.

## Konvensi teknis (warisan pelajaran gift-db)

- Semua path **relatif** dari lokasi file (`./` di root, `../` di subfolder).
- Navigasi + footer **HTML statis** di tiap halaman — situs tetap jalan tanpa JS.
- `docs/assets/app.js` = **classic script** (`defer`), tanpa `?.`/`??`/`replaceChildren`.
  Router via `document.body.dataset.page` (`download` | `changelog` | `cara-pakai`).
- Semua akses elemen di-guard; `fetch` pakai `cache:'no-store'`; setiap halaman ber-JS
  punya inline watchdog 5 detik (`window.__xyraBoot`) + kotak `#boot-error`.
- Aset diberi `?v=` — bump angkanya setiap kali file aset berubah (cache Pages ±10 menit).
- `<details>` untuk FAQ (tanpa JS).

## Alur rilis APK (urutan wajib)

1. Upload APK: `gh release create vX.Y.Z <path-apk> --title "Xyra Streamer Hub X.Y.Z" --notes "..."`
2. Edit `docs/data/releases.json`: pindahkan `latest` lama ke awal `history`, isi `latest` baru
   (version, versionCode, date, file, size, sizeText, sha256, minAndroid, arch, notes).
3. Update fallback statis (teks default untuk pengunjung tanpa JS):
   - `docs/download/index.html` — `#dl-*` + link `#dl-btn` + daftar versi lama.
   - `docs/changelog/index.html` — blok `#changelog-static`.
4. Bump `?v=` di halaman yang HTML-nya berubah.
5. Push, tunggu build (`gh api repos/xyra-dev/xyra-streamer-hub/pages/builds/latest --jq '{status,commit}'`).

Menghitung SHA-256: `Get-FileHash <apk> -Algorithm SHA256`.

## Video

- Sumber: `docs/data/video.json` — `youtubeId`, `url`, `channelUrl`, `title`, `chapters[]`
  (`{"t": detik, "label": "..."}`; chapter jadi link `youtu.be/<id>?t=<detik>`).
- Kosong = kartu "Video segera hadir" di `cara-pakai` (tidak ada tombol mati).
- Embed: thumbnail `i.ytimg.com/vi/<id>/hqdefault.jpg` + tombol play; iframe
  `youtube-nocookie` baru dibuat setelah klik (ringan, tanpa cookie YouTube sebelum klik).

## Fakta APK terakhir (v1.0.2)

- Package `com.xyra.streamerhub`, versionCode 3, minSdk 29 (Android 10+), arm64-v8a only.
- Ukuran 29.601.311 B (29,6 MB); SHA-256
  `CBB3D9030E736081DFE2882FFC5403485CEA36E2C2CD3348083D5904D363311C`.
- 1.0.0 non-minify (45,9 MB) · 1.0.1 minify pertama (29,6 MB) · semua dirilis 25 Nov 2026.
- APK **tidak pernah** disimpan di repo — selalu via GitHub Releases (repo publik → asset bisa diunduh).

## Awas

- Jangan commit `node_modules` atau file sampah; repo ini tidak punya package.json sama sekali.
- Jangan menaruh token/secret apa pun di repo (token streamer bukan milik situs).
- Jangan ubah `docs/assets/logo.png` jadi versi transparan — garis putih logo akan hilang.
