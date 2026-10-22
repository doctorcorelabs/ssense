# StrokeSense Cloudflare Worker (Edge Proxy)

This Cloudflare Worker securely stores your `OPENROUTER_API_KEY` on Cloudflare's global edge network, enables open CORS (`*`), and pipes streaming AI responses back to your Netlify web app.

---

## 🚀 Quick Deployment (2 Minutes)

### 1. Install Wrangler & Log in to Cloudflare
In this folder (`cloudflare-worker`):
```bash
npx wrangler login
```

### 2. Store Your OpenRouter API Key as a Secret
```bash
npx wrangler secret put OPENROUTER_API_KEY
```
*(Paste your `sk-or-v1-...` key when prompted)*

### 3. Deploy to the Edge
```bash
npx wrangler deploy
```

Once deployed, Wrangler will output your worker URL:
`https://strokesense-proxy.<your-subdomain>.workers.dev`

### 4. Connect to StrokeSense Web App
Open the StrokeSense web application, click the **"AI Config"** button in the top navigation bar, and paste your worker URL!
