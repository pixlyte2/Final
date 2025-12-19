const { exec } = require('child_process');
const fs = require('fs');
const { WHISPER_BIN, MODEL_PATH } = require('../config/paths');
const { readFile } = require('../utils/fileHelper');

const transcribeWithWhisper = (audioPath, language = 'ta') => {
  return new Promise((resolve, reject) => {
    const command = `"${WHISPER_BIN}" -m "${MODEL_PATH}" -f "${audioPath}" -otxt --language ${language}`;
    console.log('Running:', command);

    exec(command, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
      if (err) {
        console.error('Whisper error:', err, stderr);
        return reject(err);
      }
      const txtPath = audioPath + '.txt';
      let txt = '';
      if (fs.existsSync(txtPath)) txt = readFile(txtPath);
      else txt = stdout || '';
      resolve({ transcript: txt, txtPath });
    });
  });
};

module.exports = { transcribeWithWhisper }; // 🔥 CRITICAL
