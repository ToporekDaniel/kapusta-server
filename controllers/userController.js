const App = require("./../app");
const User = require("../models/user");
const  { signToken, generateRefreshToken, generateSessionId } = require("./authController.js");

const { v4: uuidv4 } = require("uuid");
const userValidateSchema = require("../models/userValidation.js");
const jwt = require("jsonwebtoken");



const changeBalance = async (req, res, next) => {
  try {
    const user = req.user;
    const { balance } = req.body;

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Ensure the balance is valid
    if (typeof balance !== "number" || balance < 0) {
      return res.status(400).json({ message: "Invalid balance amount" });
    }

    user.balance = balance;
    await user.save();

    res
      .status(200)
      .json({ message: "Balance updated successfully", balance: user.balance });
  } catch (error) {
    console.error("Error during balance update: ", error);
    next(error);
  }
};

// OAuth 2.0  Verify google auth token, using google-auth-library / OAuth2Client
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

// -AD- GET - api/user OAith 1.0
const user = async (req, res, next) => {
  let token = "";
  let tokenHeader = req.headers["authorization"];
  let items = tokenHeader.split(/[ ]+/);
  if (items.length > 1 && items[0].trim().toLowerCase() == "bearer") {
    token = items[1];
  }

  const user = await verify(token);

  try {
    if (user) {
      const { email, password } = user;

      const userTag = await User.findOne({
        email,
      }).select("password email verify name");

      const accessToken = signToken({
        id: userTag.id,
        username: userTag.email,
      });
      const refreshToken = generateRefreshToken(userTag.id);
      userTag.refreshToken = refreshToken;
      await userTag.save();
      const sid = generateSessionId(userTag.id);

      {
        authenticated: true, user;
      }

      res.status(200).json({
        status: "success",
        user,
        authenticated: true,
        accessToken,
        refreshToken,
        sid,
      });
    } else {
    }
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

module.exports = { changeBalance, user };
