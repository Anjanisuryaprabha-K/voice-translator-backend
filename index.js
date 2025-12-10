// index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // allow all origins (for production, restrict to your domain)

app.get("/", (req, res) => res.json({ ok: true }));

app.post("/translate", async (req, res) => {
  try {
    const { text, target } = req.body;
    if (!text || !target) return res.status(400).json({ error: "Missing text or target" });

    const url = "https://translate.googleapis.com/translate_a/single";
    const response = await axios.get(url, {
      params: { client: "gtx", dt: "t", sl: "auto", tl: target, q: text },
      timeout: 10000,
    });

    // response.data[0][0][0] contains the translation
    const translatedText = response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]
      ? response.data[0][0][0]
      : "";

    res.json({ translatedText });
  } catch (err) {
    console.error("Translate error:", err.response?.data || err.message);
    res.status(500).json({ error: "Translation failed", detail: err.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
