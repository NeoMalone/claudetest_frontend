# Hybrid AI backend

This backend is set up for a **hybrid model**:

- **Perplexity Sonar** for web-grounded research like news, order of battle research, and current events
- **Ollama local model** for everything else like world generation, turn resolution, and event writing

## Important note
This does **not** use offline Claude. Claude is currently a hosted Anthropic model family, not a local model you can run through Ollama. If you want local/offline behavior, use an Ollama model as the substitute.

## Files
- `server.js`
- `package.json`
- `.env.example`
- `.gitignore`

## Environment variables
Copy `.env.example` values into your host's environment variable settings.

### Required for web research
- `PERPLEXITY_API_KEY`

### Required for local/offline generation
- `OLLAMA_BASE_URL` - usually `http://127.0.0.1:11434`
- `OLLAMA_MODEL` - example: `llama3.1:8b`

### Optional
- `PERPLEXITY_MODEL` - defaults to `sonar`
- `PORT` - defaults to `3000`

## API endpoints

### `POST /api/worldgen`
Body:
```json
{ "userMsg": "..." }
```
Uses Ollama.

### `POST /api/resolve-action`
Body:
```json
{ "prompt": "..." }
```
Uses Ollama.

### `POST /api/event`
Body:
```json
{ "prompt": "..." }
```
Uses Ollama.

### `POST /api/web-research`
Body:
```json
{ "query": "...", "mode": "news" }
```
Uses Perplexity Sonar.

### `GET /api/health`
Quick health check.

## How to run locally

### 1. Install deps
```bash
npm install
```

### 2. Start Ollama and pull a model
Example:
```bash
ollama pull llama3.1:8b
ollama serve
```

### 3. Set environment variables
On macOS/Linux:
```bash
export PERPLEXITY_API_KEY="your_key_here"
export OLLAMA_BASE_URL="http://127.0.0.1:11434"
export OLLAMA_MODEL="llama3.1:8b"
```

### 4. Start the backend
```bash
npm start
```

## Example frontend fetches

### Local generation
```js
fetch("https://YOUR-BACKEND-URL/api/worldgen", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userMsg })
});
```

### Web research
```js
fetch("https://YOUR-BACKEND-URL/api/web-research", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "latest order of battle for country X",
    mode: "oob"
  })
});
```

## Hosting notes
- **Render/Replit** can host the Node backend
- **Ollama must run somewhere you control**
- If the backend is on Render/Replit but Ollama is only on your laptop, the hosted backend cannot see your laptop's `127.0.0.1`
- So either:
  1. run the whole backend locally with Ollama, or
  2. host on a VM/server that also runs Ollama, or
  3. replace Ollama with another cloud model

## Recommended next step
Use this backend locally first. Once it works, wire your frontend fetch calls to these endpoints.
