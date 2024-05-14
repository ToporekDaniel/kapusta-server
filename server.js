require("dotenv").config();

const { app } = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const uriDb = process.env.DB_URI;

mongoose
  .connect(uriDb)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
