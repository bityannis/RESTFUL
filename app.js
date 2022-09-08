const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 4000;
const mongoDBClient = require("./mongoClient");
const _ = require("lodash");
const Wiki = require("./models/wiki");

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

app
  .route("/articles")
  .get(async (req, res) => {
    const wikis = await Wiki.find({});
    try {
      res.send(wikis);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post((req, res) => {
    const title = req.query.title;
    const content = req.query.content;
    console.log(`Title: ${title}, Content: ${content}`);

    const newWiki = new Wiki({
      title: title,
      content: content,
    });

    newWiki.save((err, result) => {
      err ? res.send(err) : res.send(result);
    });
  })
  .delete((req, res) => {
    Wiki.deleteMany((err) => {
      err ? res.send(err) : res.send("Successfully deleted everything!");
    });
  });

app
  .route("/articles/:wiki")
  .get((req, res) => {
    const wiki = req.params.wiki;
    Wiki.find({ title: wiki }, (err, result) => {
      result ? res.send(result) : res.send(`Nothing found ${err}`);
    });
  })
  .put((req, res) => {
    const wiki = req.params.wiki;

    Wiki.updateOne(
      { title: wiki },
      { title: req.body.title, content: req.body.content },
      (err, result) => {
        result
          ? res.send(`Successfully updated ${result}`)
          : res.send(`ERROR ${err}`);
      }
    );
  })
  .patch((req, res) => {
    const wiki = req.params.wiki;

    Wiki.updateOne({ title: wiki }, { $set: req.body }, (err, result) => {
      result
        ? res.send(`Successfully updated ${result}`)
        : res.send(`ERROR ${err}`);
    });
  })
  .delete((req, res) => {
    const wiki = req.params.wiki;

    Wiki.deleteOne({ title: wiki }, (err, result) => {
      result
        ? res.send(`Successfully deleted ${(wiki, result)}`)
        : res.send(`Failed to delete ${err}`);
    });
  });

app.listen(PORT, () => {
  console.log(`Listening App on port ${PORT}`);
  mongoDBClient.init();
});
