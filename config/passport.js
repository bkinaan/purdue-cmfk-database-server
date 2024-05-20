const JWtStrategy = require("passport-jwt").Strategy;
const { Mentor } = require("../models/models");
const { ExtractJwt } = require("passport-jwt");
require("dotenv").config();

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // extract token from authorization header
  opts.secretOrKey = process.env.SECRET_KEY;

  passport.use(
    new JWtStrategy(opts, async (jwt_payload, done) => {
      try {
        const mentor = await Mentor.findOne({
          where: { username: jwt_payload.username },
        });

        if (mentor) {
          return done(null, mentor);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
