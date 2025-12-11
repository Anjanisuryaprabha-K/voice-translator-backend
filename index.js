const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // allow all origins; for production, restrict to your domain

// Simple health check
app.get("/", (req, res) => res.json({ ok: true }));

// Translation endpoint
app.post("/translate", async (req, res) => {
  try {
    const { text, target, source } = req.body;

    if (!text || !target) {
      return res.status(400).json({ error: "Missing text or target" });
    }

    const url = "https://translate.googleapis.com/translate_a/single";

    // Call Google Translate unofficial API
    const response = await axios.get(url, {
      params: {
        client: "gtx",
        dt: "t",
        sl: source || "auto", // source language, default auto
        tl: target,           // target language
        q: text,
      },
      timeout: 10000,
    });

    // Extract translated text reliably
    let translatedText = "";
    if (response.data && Array.isArray(response.data[0])) {
      translatedText = response.data[0]
        .map(segment => (segment && segment[0] ? segment[0] : ""))
        .join("");
    }

    res.json({ translatedText });
  } catch (err) {
    console.error("Translate error:", err.response?.data || err.message);
    res.status(500).json({ error: "Translation failed", detail: err.message });
  }
});

// Start backend server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
