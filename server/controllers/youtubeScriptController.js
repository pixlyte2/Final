const YoutubeScript = require("../models/YoutubeScript");
const { getContentMeta } = require("../services/contentMetaService");
const { generateTamilScript } = require("../services/ollamaService");
const { transcribeFromYoutube } = require("../services/whisperService");
const generateScript = async (req, res) => {
  try {
    const {
      url,
      duration = "1min",
      showTimestamps = false   // 🔥 NEW FLAG
    } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL required" });
    }

    // 1️⃣ Get video metadata
    const meta = await getContentMeta(url);

    // 2️⃣ Generate script (timestamps optional)
    const script = await generateTamilScript(
      meta,
      duration,
      showTimestamps
    );

    // 3️⃣ Save to DB
    await YoutubeScript.create({
      userId: req.user.id,
      url,
      duration,
      meta,
      script
    });

    // 4️⃣ Response
    res.json({
      success: true,
      duration,
      showTimestamps,
      script
    });

  } catch (err) {
    console.error("Error generating script:", err);
    res.status(500).json({ error: String(err) });
  }
};
const getExactTranscript = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "YouTube URL required" });
    }

    const transcript = await transcribeFromYoutube(url);

    res.json({
      success: true,
      transcript
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
};
module.exports = { generateScript,getExactTranscript };
