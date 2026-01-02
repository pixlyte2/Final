const axios = require('axios');

const durationMap = {
  '40sec': 'about 100 words',
  '1min': 'about 150 words',
  '3min': 'about 450 words',
  '5min': 'about 750 words'
};

const generateTamilScript = async (meta, duration) => {
  try {
    const lengthHint = durationMap[duration] || 'about 150 words';

    const prompt = `
You are a Tamil YouTube script writer.

Rules:
- Preserve meaning
- Do NOT copy exact sentences
- Use different wording
- Simple spoken Tamil
- Narration style
- Copyright safe
- Length: ${lengthHint}

Title:
${meta.title}

Description:
${meta.description}
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
    console.error('Error generating script:', err);
    throw new Error('Script generation failed');
  }
};

// 🔥 Export in one object
module.exports = { generateTamilScript };
