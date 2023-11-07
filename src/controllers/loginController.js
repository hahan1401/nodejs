import jwt from 'jsonwebtoken';
import passport from 'passport';

export const loginHandler = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      // Handle incorrect username or password
      return res
        .status(401)
        .json({ message: 'Incorrect username or password' });
    }

    // If authentication is successful, log the user in
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed' });
      }

      // Generate JWT token upon successful login
      const token = jwt.sign({ username: user.username }, 'your-secret-key');
      res.json({ message: 'Login successful', token });
    });
  })(req, res, next);
};
