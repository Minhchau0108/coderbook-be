const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");

/**
 * @route POST api/auth/login
 * @description User can login with email and password
 * @access Public
 */

router.post("/login", authController.loginWithEmail);

/**
 * @route POST api/auth/login/google
 * @description User can login with google
 * @access Public
 */

router.post(
  "/login/google",
  passport.authenticate("google-token", { session: false }),
  authController.login
);

/**
 * @route POST api/auth/login/facebook
 * @description User can login with facebook
 * @access Public
 */

router.post(
  "/login/facebook",
  passport.authenticate("facebook-token", { session: false }),
  authController.login
);

module.exports = router;
