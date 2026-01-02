const mongoose = require("mongoose");

const youtubeScriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    url: String,
    duration: String,
    meta: Object,
    script: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("YoutubeScript", youtubeScriptSchema);
