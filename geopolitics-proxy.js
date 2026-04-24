// geopolitics-proxy.js
// Simple Node.js proxy that forwards requests to Anthropic API
// Your API key stays on the server, never exposed to the browser

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Get API key from environment variable (set on Render)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable not set');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Geopolitics API proxy running' });
});

// Proxy endpoint for Anthropic API calls
app.post('/v1/messages', async (req, res) => {
  try {
    const { model, max_tokens, system, messages } = req.body;

    // Validate required fields
    if (!model || !messages) {
      return res.status(400).json({ error: 'Missing model or messages' });
    }

    // Build the request body for Anthropic
    const anthropicBody = {
      model: model || 'claude-sonnet-4-20250514',
      max_tokens: max_tokens || 4000,
      system: system || '',
      messages: messages || [],
    };

    // Call Anthropic API
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!anthropicRes.ok) {
      const errorData = await anthropicRes.text();
      console.error('Anthropic error:', anthropicRes.status, errorData);
      return res.status(anthropicRes.status).json({
        error: {
          message: `Anthropic API error: ${anthropicRes.status}`,
          details: errorData.slice(0, 200),
        },
      });
    }

    const data = await anthropicRes.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({
      error: {
        message: 'Proxy server error: ' + error.message,
      },
    });
  }
});

// Catch-all for documentation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Geopolitics API Proxy</title></head>
    <body style="font-family: monospace; padding: 20px; background: #0a0e0a; color: #7fff7f;">
      <h1>Geopolitics API Proxy</h1>
      <p>This server proxies requests to the Anthropic API with authentication.</p>
      <p>Endpoint: <code>POST /v1/messages</code></p>
      <p>Health check: <code>GET /health</code></p>
      <p style="opacity: 0.6;">Your API key is stored securely on this server.</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Geopolitics proxy listening on port ${PORT}`);
  console.log(`POST ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}/v1/messages`);
});
