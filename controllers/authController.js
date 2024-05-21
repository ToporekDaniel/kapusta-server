const { v4: uuidv4 } = require("uuid");
const App = require("./../app.js");
const passport = require("../config/passport.js");
const userValidateSchema = require("../models/userValidation.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { message } = require("../models/incomeJoi.js");

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
  });

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
  });
};

const generateSessionId = (userId) => {
  // Parsowanie czasu wygaśnięcia refresh tokena z pliku .env
  const refreshExpireTimeInSeconds = parseInt(
    process.env.JWT_REFRESH_EXPIRE_TIME,
  );
  if (isNaN(refreshExpireTimeInSeconds)) {
    throw new Error("Invalid time value");
  }

  // Obliczenie czasu wygaśnięcia SID na podstawie czasu wygaśnięcia refresh tokena
  const expiresInMs = refreshExpireTimeInSeconds * 1000; // Czas w sekundach, więc mnożymy przez 1000, aby uzyskać milisekundy
  const expirationTime = new Date(Date.now() + expiresInMs);

  // SID zawiera identyfikator użytkownika i czas wygaśnięcia w formie obiektu JSON
  const sid = {
    userId: userId,
    expiresAt: expirationTime.toISOString(), // Konwersja na ISO format
  };

  // Zakodowanie danych SID do postaci ciągu znaków
  const encodedSid = Buffer.from(JSON.stringify(sid)).toString("base64");

  return encodedSid;
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = userValidateSchema.validate(req.body);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ status: "fail", message: "Email already in use" });
    }

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return res.status(400).json({ message: `${validatingErrorMessage}` });
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
    const { error } = userValidateSchema.validate(req.body);

    if (error) {
      const validatingErrorMessage = error.details[0].message;
      return res.status(400).json({ message: `${validatingErrorMessage}` });
    }

    const user = await User.findOne({
      email,
    }).select("password email verify name");

    if (!user || !(await user.isCorrectPassword(password, user.password))) {
      return res.status(400).json({
        status: "fail",
        message: "The email or password is incorrect!",
      });
    }

    const accessToken = signToken({
      id: user.id,
      username: email,
    });
    const refreshToken = generateRefreshToken(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    const sid = generateSessionId(user.id);

    res.status(200).json({
      status: "success",
      data: { email: user.email },
      accessToken,
      refreshToken,
      sid,
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
    user.refreshToken = null;
    await user.save();
    return res.status(204).json();
  } catch (error) {
    console.error("Error during logout: ", error);
    next(error);
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;

    // Check if refresh token exists
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Verify refresh token expiration
    if (user.refreshTokenExpires < Date.now()) {
      return res.status(403).json({ error: "Refresh token has expired" });
    }

    // If refresh token is valid, attach it to the request for later use
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const refresh = async (req, res, next) => {
  try {
    const sid = req.body.sid; // Corrected to req.body.sid

    // Check if refresh token and SID exist
    if (!sid) {
      return res.status(400).json({ error: "SID are required" });
    }

    const decodedSid = JSON.parse(Buffer.from(sid, "base64").toString("utf-8"));

    // Extract user id from decoded SID
    const userId = decodedSid.userId;

    const newSid = generateSessionId(userId);
    // Generate new access token
    const accessToken = jwt.sign(
      { id: userId },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE_TIME,
      },
    );

    // Send the new access token in the response
    res.status(200).json({ accessToken, sid: newSid });
  } catch (error) {
    console.error("Error generating access token:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// -AD-
const google = async (req, res, next) => {
  try {
    // require("dotenv").config();
    const { tokens } = await App.oAuth2Client.getToken(req.body.code); // exchange code for tokens
    // console.log(tokens);

    res.json(tokens);
  } catch (e) {
    console.error(e);
  }
};

// -AD- OAuth 2.0  Verify google auth token, using google-auth-library / OAuth2Client
async function verify(token) {
  // oauth-client = oAuth2Client
  const ticket = await App.oAuth2Client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  let name = payload.name, email = payload.email, img = payload.picture;

  return {
    name,
    email,
    img,
  };
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  verifyRefreshToken,
    google,
  signToken,
  generateRefreshToken,
  generateSessionId,

};
