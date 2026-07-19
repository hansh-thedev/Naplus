const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    role: {
      type: String,
      enum: ["admin", "user", "guide", "lead-guide"],
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  },
);

// changing passwordChnagedAt timestamp if password  is changed
userSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000; // removing lagtime
});

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

userSchema.methods.passwordChanged = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const timeChanged = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < timeChanged;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 6 * 60 * 1000; // 6 mins
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
