import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function anthropicHeaders() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("Missing ANTHROPIC_API_KEY secret");
  }

  return {
    "content-type": "application/json",
    "x-api-key": key,
    "anthropic-version": "2023-06-01",
  };
}

async function callAnthropic({ system, max_tokens, messages }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: anthropicHeaders(),
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens,
      system,
      messages,
    }),
  });

  const text = await response.text();
  return { response, text };
}

const JSON_ONLY_SYSTEM =
  "You are a JSON API. You respond with raw JSON objects and nothing else - no prose, no markdown, no explanation.";

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "geopolitics-backend",
    endpoints: ["/api/worldgen", "/api/resolve-action", "/api/event"],
  });
});

app.post("/api/worldgen", async (req, res) => {
  try {
    const { userMsg } = req.body || {};
    if (!userMsg || typeof userMsg !== "string") {
      return res.status(400).json({ error: { message: "Missing userMsg string" } });
    }

    const { response, text } = await callAnthropic({
      system: JSON_ONLY_SYSTEM,
      max_tokens: 4000,
      messages: [{ role: "user", content: userMsg }],
    });

    res.status(response.status).type("application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: { message: err.message || "Unknown server error" } });
  }
});

app.post("/api/resolve-action", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: { message: "Missing prompt string" } });
    }

    const { response, text } = await callAnthropic({
      system: JSON_ONLY_SYSTEM,
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    res.status(response.status).type("application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: { message: err.message || "Unknown server error" } });
  }
});

app.post("/api/event", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: { message: "Missing prompt string" } });
    }

    const { response, text } = await callAnthropic({
      system: JSON_ONLY_SYSTEM,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    res.status(response.status).type("application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: { message: err.message || "Unknown server error" } });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Geopolitics backend running on port ${port}`);
});
