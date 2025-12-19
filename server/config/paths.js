const path = require('path');
const isWin = process.platform === 'win32';

module.exports = {
  WHISPER_BIN: path.join(__dirname, '..', '..', 'whisper', isWin ? 'whisper.exe' : 'main'),
  MODEL_PATH: path.join(__dirname, '..', '..', 'whisper', 'models', 'ggml-large-v3-turbo.bin'),
  AUDIO_DIR: path.join(__dirname, '..', 'temp_audio'),
  OUTPUT_DIR: path.join(__dirname, '..', 'output'),
  SUBTITLE_DIR: path.join(__dirname, '..', 'output', 'subtitles')
};
