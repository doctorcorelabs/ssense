# 🧠 StrokeSense

> **Next-Generation AI-Powered Stroke Education, Simulation Labs & Neuro-Rehabilitation Platform**

StrokeSense is an ultra-modern, luminous web platform designed to foster deep understanding of stroke through 3D anatomical visualization, real-time sensory/cognitive deficit simulation, epidemiological risk modeling, and on-device computer vision physical therapy coaching.

---

## ✨ 9 Core Interactive Features

| # | Feature | Technology / Core Science |
|---|---|---|
| **1** | **Golden Hour & Neuron Survival Clock** | Real-time biological decay calculation (**1.9M neurons & 14B synapses/min**) and interactive Ischemic Penumbra rescue timeline. |
| **2** | **Stroke Vision Deficit Simulator** | Live webcam & scenario canvas rendering 4 clinical deficits: *Homonymous Hemianopia, Diplopia, Visual Neglect, and Scotoma*. |
| **3** | **Aphasia Word-Struggle Lab** | Interactive challenges simulating *Broca's* expressive motor blocks, *Wernicke's* fluent receptive loss, and *Anomic* lexical lookup failure. |
| **4** | **3D Interactive Brain Vessel Explorer** | Three.js 3D WebGL model with rotatable Circle of Willis arteries (*MCA, ACA, PCA, Basilar*) and interactive clot/aneurysm triggers. |
| **5** | **Neuroplasticity "Rewiring" Playground** | Interactive canvas simulating collateral synaptogenesis and axonal sprouting as physical therapy repetitions rebuild severed circuits. |
| **6** | **Personalized Stroke Risk Index** | Validated **CHA₂DS₂-VASc** and Framingham scoring engine with interactive "What-If" blood pressure reduction modeling and AI narrative analysis. |
| **7** | **AI Hand & Finger Motor Rehab Coach** | Client-side computer vision kinematics measuring finger flexion, open palm extension, and Range-of-Motion (ROM) repetitions. |
| **8** | **Multi-Persona AI Neurologist** | Streaming conversational assistant featuring **Dr. Evelyn Vance** (Vascular Neurologist), **Professor Artie** (Everyday Analogies), and **Nurse Claire** (Recovery Coach). |
| **9** | **Drug & Herbal Supplement Interaction Guard** | Evidence-based pharmacology matrix checking lethal bleeding interactions between anticoagulants (*Warfarin, Eliquis, Plavix*) and herbs (*Ginkgo, Garlic, St. John's Wort*). |

---

## 🛠️ Architecture & Tech Stack

```
   [ Netlify Frontend (Vite + React + TS) ]
                   │
                   ▼ (Open CORS / SSE Streaming)
   [ Cloudflare Worker Edge Proxy (Wrangler) ]
                   │
                   ▼ (Authorized Request with OPENROUTER_API_KEY)
   [ OpenRouter Gateway (Gemini 2.0 Flash / Llama 3.3 / Claude 3.5) ]
```

- **Frontend**: Vite, React 18, TypeScript, Three.js, Canvas APIs, Lucide Icons, Canvas Confetti.
- **Edge Middleware**: Cloudflare Worker with open CORS (`*`) and Server-Sent Events (SSE) token streaming.
- **Styling**: Luminous Bio-Clinical Light Design System with glassmorphism, crisp borders, and fluid typography (*Plus Jakarta Sans* & *Inter*).
- **Deployment**:
  - Web Application: **Netlify** (via GitHub automatic builds).
  - Backend Edge Proxy: **Cloudflare Worker** (via Wrangler CLI).

---

## 🚀 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/your-username/strokesense.git
cd strokesense
npm install
```

### 2. Start Local Vite Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment Guide

### Deploying the Frontend to Netlify
1. Push your repository to **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of StrokeSense"
   git branch -M main
   git remote add origin https://github.com/your-username/strokesense.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com).
3. Click **"Add new site"** → **"Import an existing project"** → Choose your GitHub repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy Site**!

### Deploying the Cloudflare Worker Edge Proxy
See the step-by-step instructions in [`cloudflare-worker/README.md`](./cloudflare-worker/README.md).

---

## ⚖️ Clinical Disclaimer
StrokeSense is an educational and simulation platform designed to build empathy and improve vascular literacy. It is not a diagnostic device. If you suspect an acute stroke, **immediately contact emergency medical services (911 / 112 / 119)**. Never administer food, water, or aspirin prior to medical evaluation.
