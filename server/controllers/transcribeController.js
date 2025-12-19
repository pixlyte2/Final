const path = require('path');
const { downloadAudio } = require('../utils/ytaudio');
const { ensureDir, deleteFile } = require('../utils/fileHelper');
const { AUDIO_DIR, OUTPUT_DIR, SUBTITLE_DIR } = require('../config/paths');
const whisperService = require('../services/whisperService');
const aiContentService = require('../services/aiContentService');
const subtitleGen = require('../utils/subtitleGenerator');

ensureDir(AUDIO_DIR);
ensureDir(OUTPUT_DIR);
ensureDir(SUBTITLE_DIR);

const transcribe = async (req, res) => {
  try {
    const { url, generateSubtitle = true, rewrite = true } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });

    const audioPath = await downloadAudio(url, AUDIO_DIR);

    const { transcript, txtPath } =
      await whisperService.transcribeWithWhisper(audioPath, 'ta');

    let subtitles = null;
    if (generateSubtitle) {
      try {
        subtitles = await subtitleGen.generateSRT(audioPath);
      } catch (e) {
        console.warn('Subtitle error', e.message);
      }
    }

    const contentResult =
      await aiContentService.generateContentFromTranscript(
        transcript || '',
        { rewrite }
      );

    return res.json({
      success: true,
      transcript,
      subtitles,
      content: contentResult
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
};

module.exports = { transcribe }; // 🔥 CRITICAL
