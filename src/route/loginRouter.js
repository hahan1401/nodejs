import express from 'express';
import passport from 'passport';
import { loginHandler } from '~/controllers/loginController';

export const loginRouter = express.Router();

loginRouter.post('/login', loginHandler);

loginRouter.get('/auth/facebook', passport.authenticate('facebook'));

loginRouter.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
