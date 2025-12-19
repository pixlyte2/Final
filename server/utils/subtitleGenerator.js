const { spawn } = require('child_process');
const path = require('path');

const genSubPy = path.join(
  __dirname,
  '..',
  '..',
  'python_helpers',
  'gen_subtitle.py'
);

const generateSRT = (audioPath) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'python',
      [genSubPy, audioPath],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );

    let out = '';
    let err = '';

    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        try {
          const j = JSON.parse(out);
          resolve(j); // { srtPath, vttPath }
        } catch (e) {
          reject(
            new Error('Invalid JSON from gen_subtitle.py: ' + out)
          );
        }
      } else {
        reject(
          new Error('gen_subtitle failed: ' + err)
        );
      }
    });
  });
};

module.exports = { generateSRT }; // 🔥 CRITICAL
