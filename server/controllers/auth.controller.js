const {
  AppError,
  catchAsync,
  sendResponse,
} = require("../helpers/utils.helper");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError(400, "Invalid credentials", "Login Error"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

  accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});
authController.login = async ({ user }, res) => {
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      { avatarUrl: user.avatarUrl },
      { new: true }
    );
  } else {
    let newPassword = "" + Math.floor(Math.random() * 100000000);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    user = await User.create({
      name: user.name,
      email: user.email,
      password: newPassword,
      avatarUrl: user.avatarUrl,
    });
  }
  const accessToken = await user.generateToken();
  res.send({ user, accessToken });
};
module.exports = authController;
