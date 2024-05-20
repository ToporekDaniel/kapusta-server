const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "E-mail is required"],
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
  },
  password: {
    type: String,
    trim: true,
    required: [true, "Password is required"],
  },
  originUrl: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      description: String,
      category: String,
      amount: Number,
      date: String,
    },
  ],
  refreshToken: {
    type: String,
    default: "",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.isCorrectPassword = async function (
  passwordToCheck,
  userPassword
) {
  return await bcrypt.compare(passwordToCheck, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
