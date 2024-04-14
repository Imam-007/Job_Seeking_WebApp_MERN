import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    minLength: [3, "Name must contains alteast 3 character"],
    maxLength: [30, "Name cannot exceed 30 character"],
  },
  email: {
    type: String,
    require: [true, "Please provide email"],
    validate: [validator.isEmail, "please provide valid mail"],
  },
  phone: {
    type: Number,
    required: [true, "please provide your phone number"],
  },
  password: {
    type: String,
    required: [true, "please provide your password"],
    minLength: [8, "Password must contains 8 Character"],
    maxLength: [32, "Password can not exceed 32 character"],
  },
  role: {
    type: String,
    required: [true, "Please provide your role"],
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Hasing Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Comparing Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Jwt Token for authorization
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
