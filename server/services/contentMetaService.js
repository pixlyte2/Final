const { spawn } = require("child_process");
const path = require("path");

const getContentMeta = (url) => {
  return new Promise((resolve, reject) => {
    const py = path.join(
      __dirname,
      "..",
      "python_helpers",
      "content_meta.py"
    );

    let out = "";

    const p = spawn("python", [py, url]);

    p.stdout.on("data", (d) => (out += d.toString()));

    p.on("close", () => {
      try {
        const result = JSON.parse(out);
        if (!result.success) return reject("Metadata failed");
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = { getContentMeta };
