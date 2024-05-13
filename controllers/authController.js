const { v4: uuidv4 } = require('uuid');
const passport = require('../config/passport.js');

const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

const signToken = payload =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });

const generateRefreshToken = userId => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { 
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
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

        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  
      res.status(200).json({
        status: 'success',
        data: { email: user.email },
        accessToken,
        refreshToken,
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
      res.clearCookie("refreshToken");
      return res.status(204).json();
  } catch (error) {
      console.error("Error during logout: ", error);
      next(error);
  }
  };

  const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not provided" });
        }

        const splitToken = refreshToken.split(" ")[1];

        jwt.verify(splitToken, process.env.JWT_REFRESH_SECRET, async (err, decodedToken) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const user = await User.findOne({ _id: decodedToken.id });

            if (!user) {
                return res.status(401).json({ message: "No such user" });
            }

            const payload = {
                id: user._id,
                username: user.email,
            };

            const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
                expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
            });

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (err) {
        console.error("Error during token refresh: ", err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
next()
  }
};
// 

  module.exports = {
    register,
    login,
    logout,
    auth,
    refresh,
  };