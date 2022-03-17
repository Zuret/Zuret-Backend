const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please tell us your email"],
    // unique: [true, "email must be unique"],
    //FIXME email must be unique
    unique:true,
    trim: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  role: {
    type: String,
    enum: ["admin", "user", "lead-guide", "guide"],
    default: "user",
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    trim: true,
    minlength: [8, "a password must be at least 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    trim: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "password are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpiresAt: Date,
  active:{
    type: Boolean,
    default: true,
  }
});

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   this.password = await bcrypt.hash(this.password, 12);

//   this.passwordConfirm = undefined;
// });

// userSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) {
//     return next();
//   }
//   this.passwordChangedAt = Date.now() + 1000; // adding a second
//   next();
// });

// userSchema.pre("find", function (next) {
//   this.find({active:true});
//   next();
// })

// userSchema.methods.correctPassword = async function (
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
//   if (this.passwordChangedAt) {
//     const changedTimeStamp = parseInt(
//       this.passwordChangedAt.getTime() / 1000,
//       10
//     );
//     return JWTTimeStamp < changedTimeStamp;
//   }

//   return false; // false means password has not been changed
// };

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
