const path = require("path");
const { spawn } = require("child_process");
const { downloadAudio } = require("../utils/ytaudio");

const transcribeFromYoutube = async (url) => {
  const audioPath = await downloadAudio(url);

  return new Promise((resolve, reject) => {
    const py = path.join(
      __dirname,
      "..",
      "python_helpers",
      "whisper_runner.py"
    );

    let output = "";

    const p = spawn("python", [py, audioPath]);

    p.stdout.on("data", (d) => (output += d.toString()));
    p.stderr.on("data", (e) => console.error(e.toString()));

    p.on("close", () => {
      if (!output.trim()) {
        return reject("No transcript generated");
      }
      resolve(output.trim());
    });
  });
};

module.exports = { transcribeFromYoutube };
