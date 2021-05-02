// Initializing NPM packages
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

// Server code
app.set("view engine", "ejs");
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Mongoose configuration
mongoose.connect("mongodb://localhost/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connected to the DB successfully!");
});

// Mongoose schema
const wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Mongoose model
const wikiModel = mongoose.model("articles", wikiSchema);

// Routing express js for all the articles
app.route("/articles")
  .get(function(req, res) {
    wikiModel.find(function(err, docs) {
      if (!err) {
        res.send(docs);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    const newArticle = new wikiModel({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send(newArticle);
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    wikiModel.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted the items!");
      } else {
        res.send(err);
      }
    });
  });

// Routing express js for a single article
app.route("/articles/:articleName")
  .get(function(req, res) {
    wikiModel.findOne({
      title: req.params.articleName
    }, function(err, doc) {
      if (!err) {
        res.send(doc);
      } else {
        res.send(err);
      }
    });
  })
  .put(function(req, res) {
    wikiModel.update({
      title: req.params.articleName
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send("Put update has been done successfully!");
      } else {
        res.send(err);
      }
    })
  })
  .patch(function(req, res) {
    wikiModel.update({
      title: req.params.articleName
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Patch update has been done successfully!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    wikiModel.deleteOne({
      title: req.params.articleName
    }, function(err) {
      if (!err) {
        res.send("Delete has been done on this specific article!")
      } else {
        res.send(err);
      }
    });
  });

// Server connection
app.listen(3000, function() {
  console.log("The server is running on port 3000...");
});
