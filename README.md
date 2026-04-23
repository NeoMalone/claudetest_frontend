# Geopolitics backend for Replit

## Files
- `server.js` - Express backend that safely calls Anthropic
- `package.json` - dependencies and start script

## Replit setup
1. Create a new Node.js Repl.
2. Upload `server.js` and `package.json`.
3. Add a Replit Secret named `ANTHROPIC_API_KEY`.
4. Click Run.

## Endpoints
- `POST /api/worldgen`
  - body: `{ "userMsg": "..." }`
- `POST /api/resolve-action`
  - body: `{ "prompt": "..." }`
- `POST /api/event`
  - body: `{ "prompt": "..." }`

## Quick test
Open the Replit webview or public URL root. You should see JSON showing the service is alive.
