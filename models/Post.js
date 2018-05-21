// model for post
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  }, // separate for name and avatar so its not deleted with profile
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    // user id will go in if they like it so no repeats
    // array of user ID's
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    // array of objects
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
