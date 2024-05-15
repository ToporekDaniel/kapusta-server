const express = require("express");
const transactionsRouter = require("./routes/incomeRoutes");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/users");

const {
  OAuth2Client,
} = require("google-auth-library");

const app = express();

app.use(cors());
// app.use(cors({ origin: "tutaj będzie adres naszego frontu" }));
// dzięki temu tylko nasz front będzie mógł korzystać z naszego API

app.use(express.json());
app.use(express.static("public"));

// Create an OAuth client. This is required to obtain an authorization code,
// which, in turn, will be exchanged for the access token
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
);

app.use("/api/auth", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/transactions", transactionsRouter);
// dodatkowo przed routerem można dodać middleware autoryzujący użytkownika

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// module.exports = {
//   app,
//   oAuth2Client,
// };

exports.app = app;
exports.oAuth2Client = oAuth2Client;
