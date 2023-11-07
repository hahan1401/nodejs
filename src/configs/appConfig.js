const passport = require('passport');
import localStrategy from 'passport-local';
import { UserModel } from '~/models/user.model';
var FacebookStrategy = require('passport-facebook');

export const passportConfig = () => {
  passport.serializeUser(function (user, done) {
    done(null, user._id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
      done(err, user);
    });
  });
  return passport.use(
    new localStrategy(async function (username, password, done) {
      const user = await UserModel.findOne({ username: username });
      if (user.password === password) {
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect username or password' });
    })
  );
};

export const passportFacebookConfig = () => {
  return passport.use(
    new FacebookStrategy(
      {
        clientID: '979674750006815',
        clientSecret: 'ad5d7548362c824ede99cf0aba38572d',
        callbackURL: 'http://localhost:5151/auth/facebook/callback',
      },
      async function (accessToken, refreshToken, profile, cb) {
        const user = await UserModel.findOne({ username: 'hahan' });
        console.log('user', user);
        return cb(null, user);
      }
    )
  );
};
