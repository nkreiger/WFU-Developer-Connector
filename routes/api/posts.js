// user posts
// authentication, user, password...
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
// IMPORT = SELECT PARTS OF A MODUL, versus require takes all

// bring in models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validation
const validatePostInput = require("../../validation/post");
//router.get('/test'); // api/users/test .. api/users already included
// @route get request to api/posts/test
// @desc tests post route
// @access Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Posts Works"
  })
);

// @route Get request to api/posts
// @desc Get posts all
// @access Public, anyone can read posts
router.get("/", (req, res) => {
  Post.find()
    .sort({
      date: -1
    })
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No posts found"
      })
    );
});

// @route Get request to api/posts
// @desc Get post by id
// @access Public, anyone can read posts
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({
        nopostfound: "No post found with that ID"
      })
    );
});

// @route POST request to api/posts
// @desc Create post
// @access Private, just anyone can't create post
router.post(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar, // pull name and avatar from user state with redux, so still call from name
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE request to api/posts/:id
// @desc delete post by id
// @access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not authorized"
            });
          }

          // Delete
          post.remove().then(() =>
            res.json({
              success: true
            })
          );
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "No post found"
          })
        );
    });
  }
);

// @route Post request to api/posts/like/:id
// @desc like post with that id
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            // filter loops through it
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            // if id already in array
            return res.status(400).json({
              alreadyliked: "User already liked this post"
            });
          }

          // Add user id to likes array
          post.likes.unshift({
            user: req.user.id
          });

          // Save to database
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({
            postnotfound: "Post not found"
          })
        );
    });
  }
);

// @route Post request to api/posts/unlike/:id
// @desc unlike post with that id
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({
              notliked: "You have not yet liked this post"
            });
          }

          // get remove index
          const removeIndex = post.likes // entire array
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          // splice out of array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(400).json({
            postnotfound: "Post not found"
          })
        );
    });
  }
);

// @route Post request to api/posts/comment/:id
// @desc comment on post with that id
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      // if any errors, send 400 with errors
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments to array
        post.comments.unshift(newComment);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: "No post found"
        })
      );
  }
);

// @route DELETE request to api/posts/comment/:id/:comment
// need to know which post and which comment
// @desc remove comment from post
// @access Private

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({
            commentnotexists: "Comment does not exist"
          });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice from array
        post.comments.splice(removeIndex, 1);

        //Save
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({
          postnotfound: "Post not found"
        })
      );
  }
);

module.exports = router;
