const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/forgetPassword", authController.forgetPassword);
router.post("/register", authController.register);
router.post("/login", authController.login);
module.exports = router;
