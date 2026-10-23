# Responsive Audit and Fix - StrokeSense (ssense)

Tanggal: 2026-10-24. Cakupan: seluruh UI (5 view utama, 13 sub-view, 3 modal, layout global).

## Diagnosis awal (terukur)

- 0 breakpoint lebar aktif di seluruh kode. Satu-satunya media query di CSS yang
  terpakai adalah `prefers-reduced-motion`. Breakpoint 1024px yang ada berada di
  `src/App.css`, file sisa template Vite yang tidak pernah diimpor (dead code).
- 1.053 blok inline `style={{}}` di 26 file vs 230 `className` - inline style tidak
  dapat ditimpa media query, jadi layout tidak punya mekanisme adaptasi.
- 35 deklarasi `gridTemplateColumns`; yang terburuk butuh minimum 760-844px
  (Brain3DExplorer 844px, AISensoryAgnosiaFilter 824px, AIBrainDigitalTwin 784px,
  VirtualEVTSimulator 800px) - overflow bahkan di iPad portrait.
- CommandDock lebar intrinsik sekitar 620px (terpotong di semua HP),
  HemodynamicRibbon butuh sekitar 1.370px per baris (rusak juga di desktop).
- ConfigModal tanpa `maxHeight` dan tanpa scroll - tombol Save tidak terjangkau
  di HP landscape.
- Chat: `height: calc(100vh - 220px)` + `minHeight: 520px`, ruang ketik tersisa
  82-122px di HP, input 13px memicu auto-zoom iOS.
- 160 deklarasi font di bawah 12px; target sentuh terkecil 17px (standar 44px).

## Arsitektur perbaikan

1. Hook bersama `src/hooks/useResponsive.ts` - breakpoint 400 / 640 / 900 / 1180px
   plus deteksi layar pendek (max-height 500px). Semua komponen memakai pola yang
   sama: nilai desktop dipertahankan persis, nilai kecil hanya aktif di bawah
   breakpoint.
2. Lapisan fondasi di `src/index.css`: dock muat layar + `safe-area-inset`,
   container menyempit di HP (16px / 12px), font input 16px di mobile (anti
   auto-zoom iOS), thumb slider 26px, target sentuh 44px di perangkat sentuh
   (`pointer: coarse`), token badge yang hilang (`--red-200`, `--amber-200/700`,
   `--green-200/700`, `--violet-200`), `overflow-x: clip` di html/body,
   `background-attachment: fixed` dimatikan di perangkat sentuh.
3. `index.html`: `viewport-fit=cover` + `interactive-widget=resizes-content`.
4. `src/App.css` (dead code) dihapus. Ruang bawah `main` diperbesar agar konten
   tidak tertutup dock.

## Perbaikan per area

- Layout: Navbar satu baris di mobile (subjudul dan versi disembunyikan, pill
  BE-FAST menyusut); Ribbon menumpuk rapi di bawah 900px dengan label pendek dan
  tombol 40-44px; CommandDock bagi rata 5 tombol di mobile, chip shortcut
  disembunyikan, ikon-saja di layar sangat kecil; Footer padat dan tidak tertutup
  dock.
- OverviewHub: hero menumpuk di bawah 900px, label slider jadi grid 2x2 di
  mobile, BE-FAST 3x2 dengan tombol 44px, angka hero `clamp()`, canvas waveform
  sadar DPR.
- Brain3DExplorer: grid 1 kolom di bawah 900px, tinggi canvas 580 / 460 / 340px
  (desktop / tablet / HP), ResizeObserver + handler resize membaca ukuran
  kontainer, preset kamera target 36px, petunjuk sentuh kontekstual.
- AINeurologistChat: tinggi `dvh` adaptif tanpa min-height paksa di mobile,
  dock input wrap (Attach ikon-saja), bubble maksimum 92% mobile dan dibatasi
  760px di desktop, HUD select wrap 2x2, tabel markdown scroll horizontal.
- Studio (4): header dan switcher wrap dengan radius adaptif, judul `clamp()`,
  wrapper anak diberi containment `minWidth: 0`.
- Modal (3): `maxHeight` dalam `dvh` + scroll (ConfigModal sebelumnya tidak bisa
  di-scroll sama sekali), grid internal menumpuk di mobile, tombol tutup 40px
  dengan `aria-label`, klik backdrop dan Escape menutup, `role="dialog"`.
- Kalkulator: grid Risk menumpuk di bawah 900px, Drug guard 1 kolom di bawah
  768px + item bisa dioperasikan keyboard, Golden Hour timeline dan grid CTP
  menumpuk/wrap, teks SVG minimum 11px.
- Simulator: EVT grid menumpuk di bawah 1024px + renderer mengikuti kontainer,
  Vision elemen adegan memakai persen dan `aspect-ratio`, Aphasia tombol
  kalimat boleh wrap (mengatasi `nowrap` global), Neuroplasticity canvas
  dihitung ulang saat resize.
- Modul AI: Digital Twin renderer dan wadah disamakan tingginya (sebelumnya
  500px di wadah 420px) + ResizeObserver, Multiverse arena 1 kolom di bawah
  768px, Agnosia canvas `aspect-ratio: 4/3`, Hand Rehab HUD menjadi bar bawah
  di mobile.

## Verifikasi

- `npm run build` (tsc + vite): lolos, 0 error.
- Uji render otomatis (Playwright, Chromium): 194 pemeriksaan di 11 viewport
  (280 Fold, 320, 360, 375, 430, 768, 820, 1024, 1180 landscape, 1366, 1920) x
  semua view dan sub-view + modal. Hasil akhir: 0 elemen meluber melewati
  viewport tanpa wadah pemotong, modal ASPECTS dan Circle of Willis terbuka
  tanpa overflow di 375px dan tertutup dengan Escape.
- Pemeriksaan visual screenshot: overview 390px, overview desktop 1440px,
  Brain3D 390px, chat iPad 820px, overview iPad 820px - semua tampil rapi,
  tampilan desktop di atas 1180px tidak berubah.

## Sisa yang disadari (di luar cakupan perbaikan display ini)

- Bundle JS monolit 1,1 MB tanpa code-splitting; Three.js terbayar semua
  pengunjung. Kandidat: `React.lazy` per studio.
- 3 JPG `public/assets` total 2,2 MB tanpa varian responsif/WebP.
- Script MediaPipe di `index.html` render-blocking untuk semua halaman,
  padahal hanya dipakai Hand Rehab.
- HandRehabCoach: video kamera disembunyikan dan tidak pernah digambar ke
  canvas (temuan fungsional, bukan display).
