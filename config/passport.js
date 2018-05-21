// create strategy
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users"); // comes from modals
const keys = require("../config/keys");

const opts = {}; // empty object for options
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // payload should include the user stuff in our payload established in user.js
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user); // no error so null
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
