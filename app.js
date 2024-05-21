const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const incomeRouter = require("./routes/incomeRoutes");
const expenseRouter = require("./routes/expensesRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const authRouter = require("./routes/authRouter");
const authMid = require("./middleware/authMiddleware");
const usersRouter = require("./routes/usersRouter");


const {
  OAuth2Client,
} = require("google-auth-library");

const app = express();

app.use(cors());
// app.use(cors({ origin: "https://kapusta-app-madam-pab.netlify.app/" }));
// dzięki temu tylko nasz front będzie mógł korzystać z naszego API

app.use(express.json());
app.use(express.static("public"));
app.use(passport.initialize());

// Create an OAuth client. This is required to obtain an authorization code,
// which, in turn, will be exchanged for the access token
const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "postmessage",
);


app.use("/api/auth", authRouter);
app.use("/api/transaction/income", authMid, incomeRouter); // Zmiana ścieżki
app.use("/api/transaction/expense", authMid, expenseRouter); // Zmiana ścieżki
app.use("/api/transaction", authMid, categoryRouter); 
app.use("^/api/user/$", usersRouter); // tylko /api/user  bez authMid
app.use("/api/user/*",authMid, usersRouter);

// dodatkowo przed routerem można dodać middleware autoryzujący użytkownika

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
exports.oAuth2Client = oAuth2Client;
