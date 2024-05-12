const { v4: uuidv4 } = require('uuid');
const passport = require('../config/passport.js');

const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const signToken = payload =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const auth = async (req, res, next) => {
  await passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const register = async (req, res, next) => {
    try {
      const { body } = req;
      const { email, password } = body;
  
    const user = await User.create({
        email,
        password,
        verificationToken: uuidv4(),
      });
       
    res.status(201).json({
        status: 'success',
        message:
          'Account created.',
      });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };

  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password)
        return res
          .status(400)
          .json({ status: 'fail', message: 'Please provide an email or password' });
  
      const user = await User.findOne({
        email,
      }).select('password email verify name');
  
      if (!user || !(await user.isCorrectPassword(password, user.password)))
        return res
          .status(400)
          .json({ status: 'fail', message: 'The email or password is incorrect!' });
  
      const token = signToken({
        id: user.id,
        username: email,
      });
  
      res.status(200).json({
        status: 'success',
        data: { email: user.email },
        token,
      });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };

  const logout = async (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.token) {
          return res.status(401).json({ message: `Not authorized` });
      }
      user.token = null;
      await user.save();
      return res.status(204).json();
  } catch (error) {
      console.error("Error during logout: ", error);
      next(error);
  }
  };


  module.exports = {
    register,
    login,
    logout,
    auth,
  };