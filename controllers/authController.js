const User = require("../models/User");
const safeCompare = require("safe-compare");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/mail");

//validation for login data
async function loginHandler(req) {
  const { email, password } = req.body;
  if (!email || !password) return "Email and password must be filled";
  const user = await User.findOne({ where: { email } });
  if (!user) return "User does not exist";

  return null;
}
//validation for register data
async function registerHandler(req) {
  const { username, email, password, confirmPassword } = req.body;
  //check if username is secure
  if (!username.match(/^[a-zA-Z0-9]+$/)) return "Username must be alphanumeric";
  //check if password is secure
  //! for production, use a regex to check for password strength
  // if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/))
  //     stack.push("Password must be at least 8 characters, contain at least one lowercase letter, one uppercase letter, one number and one special character");
  if (!password || !confirmPassword)
    return "Password and confirm password must be filled";
  if (!safeCompare(password, confirmPassword))
    return "Password and confirm password must match";
  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    )
  )
    return "Email is not valid";
  const testUserMail = await User.findOne({ where: { email } });
  if (testUserMail) return "Email already exists";

  return null;
}

exports.register = async (req, res) => {
  try {
    const errors = await registerHandler(req);
    if (errors)
      return res.status(400).json({
        message: errors,
      });
    const { username, email, password } = req.body;
    //create jwt token
    const token = jwt.sign({ email }, process.env.secret);

    const user = await User.create({
      username,
      email,
      password,
    });

    return res
      .status(201)
      .cookie(token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User created successfully",
        user,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error registering user",
      error: err,
    });
  }
};

exports.login = async (req, res) => {
  console.log("login");
  try {
    const errors = await loginHandler(req);
    if (errors)
      return res.status(400).json({
        message: errors,
      });
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({
        message: "User does not exist",
      });
    if (!user.validPassword(password))
      return res.status(400).json({
        message: "Password is not correct",
      });
    //create jwt token
    const token = jwt.sign({ email }, process.env.secret);
    return res
      .status(200)
      .cookie(token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: "User logged in successfully",
        user,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error logging in user",
      error: err,
    });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token").json({
    message: "User logged out successfully",
  });
};
//!need to fix the send mail
exports.forgetPassword = async (req, res) => {
  //check if email exists
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email must be filled" });
    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      )
    )
      return res.status(400).json({ message: "Email is not valid" });
    //check if email exists
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(400).json({ message: "Email does not exist" });
    //send email with reset link
    const token = jwt.sign({ email }, process.env.secret);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const options = {
      email,
      subject: "Reset Password",
      text: `Click on the link to reset your password: ${resetLink}`,
      message: "Reset password email sent successfully",
    };
    sendEmail(options);

    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
  }
};
//!not implimented yet!
exports.resetPassword = async (req, res) => {};
