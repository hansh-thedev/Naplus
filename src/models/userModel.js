const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email address"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm password"],
      validate: {
        // works only on save method : on update use save method.
        validator: function (el) {
          return el === this.password;
        },
        message: "Password doesn't match! Please confirm your password ",
      },
    },
    photo: {
      type: String,
      default: "default_user.jpg",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
  this.passwordConfirm = undefined; // not persist to DB
});

// Instance methods for checking if password is correct
userSchema.methods.correctPassword = async function (password, hashedPass) {
  return await bcrypt.compare(password, hashedPass);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
