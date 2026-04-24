# Deploy Geopolitics with Proxy Backend on Render

This guide gets you running **geopolitics_v9.html** on both your PC and Chromebook, with a secure backend proxy on Render.

## What You're Setting Up

- **Game frontend** (geopolitics_v9.html) — runs on your PC locally, or hosted on Render
- **API Proxy** (geopolitics-proxy.js) — runs on Render, holds your Anthropic API key securely
- Both communicate securely via HTTPS

## Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com/account/keys
2. Create an API key (or copy an existing one)
3. Keep it safe — you'll paste it into Render in a moment

## Step 2: Deploy the Proxy on Render (5 minutes)

### 2a. Create a GitHub repo (or use Render's built-in Git)

Simplest way: use Render's built-in editor.

1. Go to https://render.com (sign up if needed, it's free)
2. Click **New +** → **Web Service**
3. Choose **Public Git Repository** and paste this URL:
   ```
   https://github.com/your-username/geopolitics-proxy
   ```
   OR choose **Build and deploy from Git** and Render will let you upload files directly.

### 2b. If using Render's file upload:

1. In Render, click **Create** → **Web Service** → **Public Git repository**
2. On the next screen, there's a box to paste a GitHub URL — instead, look for **"Or, connect a repository"** and choose **"Upload files"**
3. Upload these two files:
   - `geopolitics-proxy.js`
   - `package.json`

### 2c. Configure the Web Service

**Name:** `geopolitics-proxy` (or whatever you like)

**Environment:** `Node`

**Build Command:** `npm install`

**Start Command:** `npm start`

**Environment Variables:** Click **Add Environment Variable**
- Key: `ANTHROPIC_API_KEY`
- Value: `sk-ant-...` (paste your API key here)

Click **Create Web Service**

Render will start deploying. Wait ~2-3 minutes. You'll see a green checkmark and a URL like:
```
https://geopolitics-proxy-xxxxx.onrender.com
```

**Copy that URL** — you'll need it next.

## Step 3: Deploy the Game Frontend

You have two options:

### Option A: Host the HTML on Render (easiest)

1. On Render, click **New +** → **Static Site**
2. Upload or paste `geopolitics_v9.html` as your files
3. Click **Create Static Site**
4. You'll get a URL like `https://geopolitics-xxxxx.onrender.com`

### Option B: Just use the HTML file on your PC (no deployment needed)

1. Download `geopolitics_v9.html`
2. Double-click it on your PC — it works locally

## Step 4: Connect the Game to the Proxy

**On your PC (local version):**

1. Open `geopolitics_v9.html` (double-click)
2. Click **⚙ BACKEND** (top-right)
3. Change mode to **PROXY**
4. Paste your proxy URL:
   ```
   https://geopolitics-proxy-xxxxx.onrender.com
   ```
5. Click **SAVE & CLOSE**
6. Play!

**On your Chromebook (or anywhere else):**

1. If you deployed the frontend on Render, open that URL
2. If you're just using the PC version, you can access it from another device:
   - Copy `geopolitics_v9.html` to a USB drive, or
   - Host it on Render (Option A above), or
   - Use a service like https://surge.sh or GitHub Pages to host it
3. On Chromebook, follow the same **⚙ BACKEND** → **PROXY** setup with your proxy URL

## Testing

**Test the proxy first:**

1. Open your proxy URL in a browser: `https://geopolitics-proxy-xxxxx.onrender.com`
2. You should see a page saying "Geopolitics API Proxy" and "status: ok"
3. If you see an error, check that:
   - Your API key environment variable is set correctly on Render
   - The proxy service is still running (check Render's logs)

**Test the game:**

1. Open the HTML file
2. Click **⚙ BACKEND** → **PROXY** mode
3. Enter your proxy URL
4. Try starting a new game
5. If it works, you'll see the world generation start

## Troubleshooting

**"Failed to fetch" error:**
- Make sure your proxy URL is correct (no trailing slash)
- Make sure the proxy service is running on Render (check the dashboard)
- Make sure your ANTHROPIC_API_KEY environment variable is set

**Proxy says "ANTHROPIC_API_KEY environment variable not set":**
- Go to your Render service dashboard
- Click **Environment** in the left sidebar
- Add/edit the `ANTHROPIC_API_KEY` variable

**Anthropic API errors (402, 429, etc):**
- Your API key might be invalid or have expired
- Your account might not have credits (if using free trial)
- You might be rate-limited — wait a few minutes and try again

## Costs

- **Render proxy:** Free tier (will spin down after 15 min of inactivity, but wakes up fast)
- **Game frontend:** Free tier on Render, or just run locally
- **Anthropic API:** You pay for tokens used — typical turn costs ~$0.01-0.05

## Optional: Use the PC Version Without Deploying

If you don't want to deploy anything:

1. Download `geopolitics_v9.html`
2. Download the proxy files (`geopolitics-proxy.js` and `package.json`)
3. On your PC, in a Terminal:
   ```
   npm install
   ANTHROPIC_API_KEY=sk-ant-... npm start
   ```
4. Open `http://localhost:3000/health` in your browser — should say "status: ok"
5. Then open `geopolitics_v9.html` locally and set BACKEND to PROXY: `http://localhost:3000`

This way the proxy runs on your PC and you don't need Render.

---

That's it! Questions? Let me know.
