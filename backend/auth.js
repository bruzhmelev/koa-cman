const passport = require('koa-passport');
const storage = require('./temp/localUserStorage');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await storage.fetchUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log('LocalStrategy username: ' + username);
    storage
      .fetchUsersByName(username)
      .then(users => {
        const user = users[0];
        if (username === user.username && password === user.password) {
          done(null, user);
        } else {
          done(null, false);
        }
      })
      .catch(err => done(err));
  })
);

// // https://github.com/mapmeld/koa-passport-example/blob/mongodb/auth.js
// const FacebookStrategy = require('passport-facebook').Strategy;
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: 'your-client-id',
//       clientSecret: 'your-secret',
//       callbackURL:
//         'http://localhost:' +
//         (process.env.PORT || 3000) +
//         '/auth/facebook/callback'
//     },
//     function(token, tokenSecret, profile, done) {
//       // retrieve user ...
//       storage.fetchUsersByName().then(user => done(null, user));
//     }
//   )
// );

const FacebookStrategy = require('passport-facebook').Strategy;
// from https://www.djamware.com/post/59a6257180aca768e4d2b132/node-express-passport-facebook-twitter-google-github-login
var User = require('./models/User');

passport.use(
  new FacebookStrategy(
    {
      clientID: '290170838239980',
      clientSecret: '106448d32c26c7ae95d7314ff4b636b1',
      callbackURL: 'http://127.0.0.1:4003/v1/auth/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { name: profile.displayName },
        { name: profile.displayName, userid: profile.id },
        function(err, user) {
          if (err) {
            return done(err);
          }
          done(null, user);
        }
      );
    }
  )
);

// const TwitterStrategy = require('passport-twitter').Strategy;
// passport.use(
//   new TwitterStrategy(
//     {
//       consumerKey: 'your-consumer-key',
//       consumerSecret: 'your-secret',
//       callbackURL:
//         'http://localhost:' +
//         (process.env.PORT || 3000) +
//         '/auth/twitter/callback'
//     },
//     function(token, tokenSecret, profile, done) {
//       // retrieve user ...
//       storage.fetchUserByName().then(user => done(null, user));
//     }
//   )
// );

// const GoogleStrategy = require('passport-google-auth').Strategy;
// passport.use(
//   new GoogleStrategy(
//     {
//       clientId: 'your-client-id',
//       clientSecret: 'your-secret',
//       callbackURL:
//         'http://localhost:' +
//         (process.env.PORT || 3000) +
//         '/auth/google/callback'
//     },
//     function(token, tokenSecret, profile, done) {
//       // retrieve user ...
//       storage.fetchUserByToken().then(user => done(null, user));
//     }
//   )
// );

module.exports = passport;
