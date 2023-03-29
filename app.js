const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/booksDB", {useNewUrlParser: true});

const booksSchema = {
    id: String,
    title: String,
    author: String,
    year: String
};

const Book = mongoose.model("Book", booksSchema);
app.route("books")
.get(function(req, res){
    Book.find(function(err, foundBooks){
      if (!err) {
        res.send(foundBooks);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res){

    const newBook = new Book({
      id: req.body.id,
      title: req.body.title,
      author: req.body.author,
      year: req.body.year
    });
  
    newBook.save(function(err){
      if (!err){
        res.send("Successfully added a new book.");
      } else {
        res.send(err);
      }
    });
  });

  app.route("/books/:bookID")

  .get(function(req, res){
  
    Book.findOne({id: req.params.bookID}, function(err, foundBook){
      if (foundBook) {
        res.send(foundBook);
      }
      else if(err){
        res.send(err);
      }
       else {  
        res.send("No books matching that title was found.");
      }
    });
  })
  .put(function(req, res){

    Book.updateOne(
      {id: req.params.bookID},
      {id: req.params.bookID, title: req.body.title, author: req.body.author, year : req.body.year},
      {overwrite: true},
      function(err){
        if(!err){
          res.send("Successfully updated the selected article.");
        }
        else{
            res.send(err);
        }
      }
    );
  })
  .delete(function(req, res){

    Book.deleteOne(
      {id: req.params.bookID},
      function(err){
        if (!err){
          res.send("Successfully deleted the corresponding article.");
        } else {
          res.send(err);
        }
      }
    );
  });


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });