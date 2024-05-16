const User = require("../models/user");

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

module.exports = { changeBalance };
