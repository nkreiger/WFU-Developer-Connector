const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport"); // lot of other submoduls
// routes
const path = require("path");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middleware, to access req.body.whatever
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;
// pertains to mongoURI value

// Connect to MongoDB with mongoose, promise
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.log(err)); // auth failed
// basically a try, catch error if doesn't work

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);
// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  // for any route that gets hit load react index.html file in build
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
// heroku or local

app.listen(port, () => console.log(`Server running on port ${port}`)); // use ` not '
