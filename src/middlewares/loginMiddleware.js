import passport from 'passport';
import jwt from'jsonwebtoken';

export const loginMiddleware = () =>
  passport.authenticate('local', { failureRedirect: '/login' });

export const jwtAuthMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    req.user = user;
    next();
  });
};
