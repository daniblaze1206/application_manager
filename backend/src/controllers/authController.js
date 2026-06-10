const userModel = require("../models/User");
const registerValidator = require("../validators/registerValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res) => {
  try {
    const validationResult = registerValidator(req.body);
    if (validationResult && validationResult.length > 0) {
      return res.status(422).json({ message: "invalid input" });
    }
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.secret_key,
    );
    console.log(accessToken.userId);
    return res
      .status(201)
      .json({
        newUser: newUser,
        token: accessToken,
        message: "new user registered successfully",
      });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "username, email or password is wrong" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ message: "username, email or password is wrong" });
    }
    const accessToken = jwt.sign({ userId: user._id }, process.env.secret_key, {
      expiresIn: "1 day",
    });
    return res
      .status(200)
      .json({ token: accessToken, message: "user logged in successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  register,
  login,
};
