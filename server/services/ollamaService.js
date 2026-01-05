const axios = require("axios");

const durationMap = {
  "40sec": "about 100 words",
  "1min": "about 150 words",
  "3min": "about 450 words",
  "5min": "about 750 words"
};

const generateTamilScript = async (meta, duration, showTimestamps = false) => {
  try {
    const lengthHint = durationMap[duration] || "about 150 words";

    const prompt = `
நீ ஒரு அனுபவம் வாய்ந்த தமிழ் YouTube Narrator.

முக்கிய கட்டுப்பாடுகள் (STRICT):
- முழுக்க முழுக்க தெளிவான, அர்த்தமுள்ள தமிழ்
- கற்பனை / அர்த்தமில்லாத வாக்கியங்கள் வரக்கூடாது
- புராண / வரலாறு தகவல்கள் தவறாக இருக்கக்கூடாது
- Spoken narration போல இருக்க வேண்டும்
- English mix வேண்டாம்
- Bullet points வேண்டாம்
- "Script writer", "Note", "Explanation" போன்ற வார்த்தைகள் வரக்கூடாது

${showTimestamps ? `
OUTPUT FORMAT:
தலைப்பு:

(00-05 விநாடிகள்)
(05-15 விநாடிகள்)
(15-25 விநாடிகள்)
(25-35 விநாடிகள்)
(35-45 விநாடிகள்)
` : `
OUTPUT FORMAT:
தலைப்பு:
ஒரே flow narration paragraph
`}

Length: ${lengthHint}

தலைப்பு:
${meta.title}

வீடியோ விவரம்:
${meta.description}

மேலுள்ள தகவல்களை அடிப்படையாக கொண்டு,
YouTube narration-க்கு ready ஆன
**தெளிவான, அர்த்தமுள்ள தமிழ் script** எழுதவும்.
`;

    const res = await axios.post(
      `${process.env.OLLAMA_URL}/api/generate`,
      {
        model: process.env.OLLAMA_MODEL,
        prompt,
        stream: false
      }
    );

    return res.data.response;
  } catch (err) {
    console.error("Error generating script:", err);
    throw new Error("Script generation failed");
  }
};

module.exports = { generateTamilScript };
