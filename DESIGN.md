# Design System: StrokeSense
*Generated via Google Stitch Semantic Design System Specification (`taste-design`)*

## 1. Visual Theme & Atmosphere
- **Atmosphere**: A luminous, authoritative Swiss Bio-Clinical Dossier. The feeling is that of an elite neurovascular research center or a high-end medical workstation — pristine, calm, high-density, and tactile.
- **Density**: 7/10 (High-information density balanced with clean negative space).
- **Variance**: 7/10 (Asymmetric Bento grids, varied tile proportions 2×2, 2×1, 1×1).
- **Motion**: 6/10 (Weighted spring-physics transitions, continuous physiological waveform canvas, smooth spatial docking).

## 2. Color Palette & Roles
- **Canvas Light** (`#F8FAFC`) — Primary background canvas (Slate-50 tint).
- **Pure Surgical White** (`#FFFFFF`) — Tile and card surface containers.
- **Surface Muted** (`#F1F5F9`) — Secondary segment backgrounds and subtle recessed wells.
- **Deep Slate Ink** (`#0F172A`) — Primary text and headers (high 12:1 WCAG contrast ratio).
- **Clinical Slate** (`#334155` / `#475569`) — Body text, descriptions, and labels.
- **Whisper Hairline** (`#E2E8F0`) — 1px razor-sharp structural borders and dividers.
- **Surgical Cobalt** (`#2563EB` / `#1D4ED8`) — Primary interactive accent, active studio dock tab, perfusion telemetry.
- **Arterial Crimson Rose** (`#E11D48`) — High clinical urgency only (BE-FAST triage, ischemic infarct core, hemorrhage alerts).
- **Viable Sage / Emerald** (`#059669`) — Normal perfusion, motor recovery milestones, normal blood pressure indicators.
- **Occlusion Amber** (`#D97706`) — Ischemic penumbra, moderate drug caution, borderline vitals.
- **Neural Violet** (`#7C3AED`) — Hebbian synaptogenesis rewiring, language processing, cognitive empathy.

## 3. Typography Rules
- **Display & Headings**: `Plus Jakarta Sans` — Track-tight (`-0.025em`), geometric sans with confident human personality.
- **Body & Clinical Descriptions**: `Inter` — Relaxed leading (`1.6`), max 68 characters line-width for effortless medical reading.
- **Clinical Data & Metrics**: `JetBrains Mono` — Monospaced for blood pressures, coordinates, Doppler speeds, timers, and TICI scores.
- **Banned**: Inter for display headings, generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`), pure black (`#000000`).

## 4. Component Stylings
- **Buttons**: Tactile push feedback (`transform: scale(0.98)` on active). Flat subtle ambient drop shadows. No artificial outer neon glows.
  - Primary: Cobalt `#2563EB` with subtle top inner highlight.
  - Secondary: Surgical White `#FFFFFF` with `#E2E8F0` hairline border.
  - Danger: Crimson Rose `#E11D48`.
- **Bento Tiles**: Generously rounded (`16px`), 1px `#E2E8F0` border, optical ambient shadow (`0 1px 3px rgba(15,23,42,0.05), 0 8px 20px -4px rgba(15,23,42,0.03)`). Hover lifts subtly by `-2px` with a slate border tone.
- **Floating Command Dock**: Centered floating pill dock at the bottom screen with frosted glass backdrop (`rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(16px)`), keyboard shortcuts (`1` to `4`), and smooth sliding pill transitions.
- **Inputs & Sliders**: Clean white background, `#E2E8F0` border, cobalt focus ring with `3px rgba(37, 99, 235, 0.12)`.
- **Status Pills**: Muted soft tints with colored text (e.g. Cobalt `#EFF6FF` bg with `#1D4ED8` text, Crimson `#FFF1F2` bg with `#E11D48` text).

## 5. Layout Principles
- **Asymmetrical Bento Hero**: Left 65% interactive acute perfusion dossier with live time-slider and CT mismatch; Right 35% interactive BE-FAST anatomical switchboard.
- **4 Consolidated Studios**: Instead of 10 isolated, monotonous tabs, tools are unified into:
  1. *Studio 1: Acute Vascular & 3D Anatomy Suite* (Three.js WebGL Circle of Willis + Golden Hour Perfusion Clock).
  2. *Studio 2: Sensory & Cognitive Empathy Lab* (Stroke Vision Simulator + Aphasia Word-Struggle Lab).
  3. *Studio 3: Neuroplasticity & Motor Rehab Arena* (MediaPipe Hand Kinematics + Hebbian Synaptogenesis Engine).
  4. *Studio 4: Clinical Copilot & Safety Guard* (AI Neurologist Chat + Drug/Herbal Bleeding Hazard Matrix + Risk Index).
- **Responsive Architecture**: Multi-column layouts cleanly collapse to single-column on mobile (< 768px). Touch targets minimum 44px. No horizontal scroll.

## 6. Motion & Interaction
- **Spring Physics**: Smooth damping (`cubic-bezier(0.16, 1, 0.3, 1)`) for all hover and toggle states.
- **Real-Time Perfusion ECG**: Continuous live waveform animation on HTML5 Canvas representing cerebral hemodynamic pulsatility.
- **Hardware Acceleration**: Only animate `transform` and `opacity`.

## 7. Anti-Patterns (Banned AI Slop)
- ❌ No neon or outer glow shadows on dark backgrounds.
- ❌ No pure black (`#000000`).
- ❌ No monotonous 3-column equal card rows with identical icon boxes.
- ❌ No generic AI marketing buzzwords ("Elevate", "Unleash", "Next-Gen AI").
- ❌ No emojis used as UI icons (use clean Lucide SVG icons).
- ❌ No fabricated or invented uptime metrics ("99.99% AI ACCURACY", "124ms RESPONSE").
- ❌ No filler UI text like "Scroll to explore" with bouncing arrows.
