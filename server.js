var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var mongojs = require("mongojs")

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/Scrapper", {
  useMongoClient: true
});

// Routes

// A GET route for scraping the echojs website
app.get("/api/scrape/", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.echojs.com/").then(function(response) {
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({
    saved: false
  })
    // Specify that we want to populate the retrieved libraries with any associated books
    .then(function(dbArticle) {
      // If any Libraries are found, send them to the client with any associated Books
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.get("/articles/saved", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({
    saved: true
  })
  .populate('notes')
  .then(function(dbArticle) {
      console.log(dbArticle)
      res.json(dbArticle);
  }).catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});


app.put("/articles/unsaved/:id", function(req, res){
  db.Article.findOneAndUpdate({ _id: req.params.id}, {$set:{saved: false}})
  .then(function(result){
    res.json(result)
  })
  .catch(function(error){
    res.json(error)
  })

})

app.put("/articles/saved/:id", function(req, res){
  db.Article.findOneAndUpdate({ _id: req.params.id}, {$set:{saved: true}})
  .then(function(result){
    res.json(result)
  })
  .catch(function(error){
    res.json(error)
  })

})

// Route for saving/updating an Article's associated Note
app.post("/articles/note/:id", function(req, res) {
  
  
  db.Note.create(req.body)
  .then(function(dbNote) {

    return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
  })
  .then(function(dbArticle) {
    // If the User was updated successfully, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});


app.delete('/articles/note/delete/:id', function(req, res){
  let articleId = req.body.articleId
  console.log(req.body.articleId)
  
  db.Note.findByIdAndRemove({_id: req.params.id})
    .then(function(note){
      res.json(note)
      //return db.Article.findByIdAndUpdate({_id: req.body.articleId}, {$unset: {notes: {_id: req.params.id}}})
    }).catch(function(error){
      res.json(error)
  })
  
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
