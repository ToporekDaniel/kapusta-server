const { v4: uuidv4 } = require('uuid');
const passport = require('../config/passport.js');

const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const { message } = require('../models/incomeJoi.js');

const signToken = payload =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });

const generateRefreshToken = userId => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
};

function generateSessionId() {
  return uuidv4();
};

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
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(409).json({status: 'fail', message: "Email already in use"})
  }
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
  
        const accessToken = signToken({
            id: user.id,
            username: email,
        });
        const refreshToken = generateRefreshToken(user.id);

        const sid = generateSessionId();
 
      res.status(200).json({
        status: 'success',
        data: { email: user.email },
        accessToken,
        refreshToken,
        sid,
      });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };

  const logout = async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
          return res.status(401).json({ message: `Not authorized` });
      }      
      return res.status(204).json();
  } catch (error) {
      console.error("Error during logout: ", error);
      next(error);
  }
  };


const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    if (user.refreshTokenExpires < Date.now()) {
      return res.status(403).json({ error: 'Refresh token has expired' });
    }

    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    console.error('Error verifying refresh token:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const refresh = async (req, res, next) => {
  try {
    
    const sid = req.body.sid;

    if (!sid) {
      return res.status(400).json({ error: 'SID are required' });
    }

    const newSid = generateSessionId();
    
    const accessToken = jwt.sign({ id: req.userId }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
    });

    res.status(200).json({ accessToken, sid: newSid });
  } catch (error) {
    console.error('Error generating access token:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

  module.exports = {
    register,
    login,
    logout,
    auth,
    refresh,
    verifyRefreshToken
  };