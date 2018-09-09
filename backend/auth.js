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

const FacebookStrategy = require('passport-facebook').Strategy;
passport.use(
  new FacebookStrategy(
    {
      clientID: 'your-client-id',
      clientSecret: 'your-secret',
      callbackURL:
        'http://localhost:' +
        (process.env.PORT || 3000) +
        '/auth/facebook/callback'
    },
    function(token, tokenSecret, profile, done) {
      // retrieve user ...
      storage.fetchUsersByName().then(user => done(null, user));
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

const GoogleStrategy = require('passport-google-auth').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientId: 'your-client-id',
      clientSecret: 'your-secret',
      callbackURL:
        'http://localhost:' +
        (process.env.PORT || 3000) +
        '/auth/google/callback'
    },
    function(token, tokenSecret, profile, done) {
      // retrieve user ...
      storage.fetchUserByToken().then(user => done(null, user));
    }
  )
);
