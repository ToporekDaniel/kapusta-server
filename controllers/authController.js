const { v4: uuidv4 } = require("uuid");
// const passport = require("../config/passport.js");
const  App  = require("./../app.js");

const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
};

const auth = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
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
      return res.status(409).json({
        status: "fail",
        message: "Email already in use",
      });
    }
    const user = await User.create({
      email,
      password,
      verificationToken: uuidv4(),
    });

    res.status(201).json({
      status: "success",
      message: "Account created.",
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Please provide an email or password",
        });
    }

    const user = await User.findOne({
      email,
    }).select("password email verify name");

    if (!user || !(await user.isCorrectPassword(password, user.password))) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "The email or password is incorrect!",
        });
    }

    const accessToken = signToken({
      id: user.id,
      username: email,
    });
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      status: "success",
      data: { email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
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

//   const refresh = async (req, res, next) => {
//     const { refreshToken}  = req.body;

//     if (!refreshToken) {
//         return res.status(401).json({ message: 'Refresh token is required' });
//     }

//     const splitToken = refreshToken.split(' ')[1];
//     console.log(splitToken);

//     jwt.verify(splitToken, process.env.JWT_REFRESH_SECRET, async (err, decodedToken) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         }

//         const user = await User.findOne({ _id: decodedToken.id});

//         if (!user) {
//             return res.status(401).json({ message: 'No such user' });
//         }

//         const payload = {
//             id: user._id,
//             username: user.username,
//         };

//         const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME });
//         const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME });

//         return res.json({ accessToken, refreshToken: newRefreshToken });
//     });
// }

const google = async (req, res, next) => {
  try {
    // require("dotenv").config();
    const { tokens } = await App.oAuth2Client.getToken(req.body.code); // exchange code for tokens
    console.log(tokens);

    res.json(tokens);
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  register,
  login,
  logout,
  auth,
  google,
  // refresh,
};
