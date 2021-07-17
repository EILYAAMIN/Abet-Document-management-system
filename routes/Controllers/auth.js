const express = require("express");
const router = express.Router();
const Auth = require("../Controles/auth");
const auth = require('../../middleware/auth');

router.get("/", auth, Auth.getUser);

router.post("/login", Auth.signIn);

router.post("/register", Auth.signUp);

router.post("/emailVerificatoin/:token", Auth.emailVerification);

router.post("/resendVerificationCode", auth, Auth.resendVerificatoinCode);

router.post("/sendPasswordResetToken", Auth.sendPasswordResetToken);

router.post("/verifyResetToken", Auth.verifyResetToken);

router.post("/resetPassword", auth, Auth.resetPassword);


module.exports = router;