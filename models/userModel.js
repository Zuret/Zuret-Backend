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
    //FIXME email uniqueness validation is not working
    unique: [true, "email must be unique"],
    trim: true,
    validate: [validator.isEmail, "please provide a valid email address"],
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
  passwordChangedAt: Date
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp){

  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp; 

  }

  return false; // false means password has not been changed
}

const User = mongoose.model("User", userSchema);

module.exports = User;
