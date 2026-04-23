# Geopolitics backend for Render

## Files
- `server.js` - Express backend that safely calls Anthropic
- `package.json` - dependencies and start script

## Endpoints
- `POST /api/worldgen`
  - body: `{ "userMsg": "..." }`
- `POST /api/resolve-action`
  - body: `{ "prompt": "..." }`
- `POST /api/event`
  - body: `{ "prompt": "..." }`
