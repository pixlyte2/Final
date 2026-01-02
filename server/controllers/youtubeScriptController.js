const YoutubeScript = require("../models/YoutubeScript");
const { getContentMeta } = require("../services/contentMetaService");
const { generateTamilScript } = require("../services/ollamaService");

const generateScript = async (req, res) => {
  try {
    const { url, duration = "1min" } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const meta = await getContentMeta(url);
    const script = await generateTamilScript(meta, duration);

    await YoutubeScript.create({
      userId: req.user.id,
      url,
      duration,
      meta,
      script
    });

    res.json({ success: true, duration, script });
  } catch (err) {
    console.error("Error generating script:", err);
    res.status(500).json({ error: String(err) });
  }
};

module.exports = { generateScript };
