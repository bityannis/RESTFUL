const mongoose = require("mongoose");

const wikiSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { collection: "myRESTFUL" }
);

const Wiki = mongoose.model("Wiki", wikiSchema);

module.exports = Wiki;
