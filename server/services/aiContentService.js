const { spawn } = require('child_process');
const path = require('path');

const contentPy = path.join(
  __dirname,
  '..',
  '..',
  'python_helpers',
  'content_helper.py'
);

const generateContentFromTranscript = (transcript, options = {}) => {
  return new Promise((resolve, reject) => {
    const proc = spawn('python', [contentPy], { stdio: ['pipe', 'pipe', 'pipe'] });

    let out = '', err = '';

    proc.stdout.on('data', d => out += d.toString());
    proc.stderr.on('data', d => err += d.toString());

    proc.on('close', code => {
      if (code === 0) {
        try {
          const json = JSON.parse(out);
          resolve(json);
        } catch (e) {
          reject(new Error('Invalid JSON from content_helper: ' + e.message));
        }
      } else {
        reject(new Error('content_helper failed: ' + err));
      }
    });

    proc.stdin.write(JSON.stringify({ transcript, options }));
    proc.stdin.end();
  });
};

module.exports = { generateContentFromTranscript }; // 🔥 CRITICAL
