# Xyra Streamer Hub — Website

Situs publik untuk app Android **Xyra Streamer Hub** (Xyra Studio):
salam singkat + branding, panduan berbasis video YouTube, dan download APK via GitHub Releases.

**Live:** https://xyra-dev.github.io/xyra-streamer-hub/

## Isi

- **Home** — salam, 3 poin fitur, ringkasan 5 langkah, CTA download.
- **Cara Pakai** — video (lite-embed). Penjelasan lengkap sengaja dipindah ke video; halaman cuma pintu masuknya + ringkasan langkah.
- **Download** — APK versi terbaru, spesifikasi, SHA-256, cara install singkat.
- **FAQ** — troubleshooting teks (Play Protect, token, MIUI battery, dll).
- **Changelog** — riwayat versi.

## Update isi

| Yang mau diubah | File yang disentuh |
|---|---|
| Versi APK baru | Upload ke GitHub Releases, lalu edit `docs/data/releases.json` (fallback statis di `download/` & `changelog/` opsional) |
| Link video YouTube | `docs/data/video.json` saja — HTML tidak perlu disentuh |
| Warna/tema | `docs/assets/style.css` (jangan lupa bump `?v=` di semua halaman) |

Preview lokal: `python -m http.server 4321 --directory docs` → buka `http://127.0.0.1:4321/`.

## Rilis APK baru

1. `gh release create vX.Y.Z "Apps Release path\XyraStreamerHub-X.Y.Z.apk" --title "..." --notes "..."`
2. Update `docs/data/releases.json` (pindahkan `latest` lama ke `history`).
3. Push → tunggu build Pages ±1 menit.

Detail teknis & konvensi: lihat `AGENTS.md`. Catatan proyek: `PROGRESS.md`.

## Disclaimer

Proyek independen oleh Xyra Studio. Bukan produk resmi, tidak berafiliasi dengan TikTok atau Roblox.
