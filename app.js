const express = require("express");
const transactionsRouter = require("./routes/incomeRoutes");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const authMid = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
// app.use(cors({ origin: "tutaj będzie adres naszego frontu" }));
// dzięki temu tylko nasz front będzie mógł korzystać z naszego API

app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/transactions", authMid, transactionsRouter);
// app.use("/api/user", authMid, usersRouter);
// dodatkowo przed routerem można dodać middleware autoryzujący użytkownika

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
