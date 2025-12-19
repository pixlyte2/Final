const { spawn } = require('child_process');
const path = require('path');

const downloadAudio = (youtubeUrl, outputDir) => {
  return new Promise((resolve, reject) => {
    const py = path.join(
      __dirname,
      '..',
      '..',
      'python_helpers',
      'ytaudio.py'
    );

    const proc = spawn(
      'python',
      [py, youtubeUrl, outputDir],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let out = '';
    let err = '';

    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        try {
          const result = JSON.parse(out);
          resolve(result.path);
        } catch (e) {
          reject(
            new Error('Invalid response from ytaudio: ' + out)
          );
        }
      } else {
        reject(
          new Error('ytaudio failed: ' + err)
        );
      }
    });
  });
};

module.exports = { downloadAudio }; // 🔥 VERY IMPORTANT
