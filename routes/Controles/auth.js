const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const nodemailerKey = config.get("nodemailerKey");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

module.exports = class auth {
  static async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select(["-password", "-verificationcode"]);
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async signIn(req, res) {
    [
      check("email", "Please include a valid email")
        .isEmail()
        .normalizeEmail({ remove_dots: false }),
      check("password", "password is required!").exists(),
    ];
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .send({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.statusCode(500).send("Server Error");
    }
  }

  static async signUp(req, res) {
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Email is required").isEmail(),
      check("password", "Password is required").isLength({ min: 6 }),
    ];
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, idNum, email, password, course } = req.body;

    if (!email.includes("@emu.edu.tr"))
      return res
        .status(401)
        .json({ errors: [{ msg: "Please Enter your personal email" }] });

    try {
      let user = await User.findOne({
        $or: [{ email: email }, { idNum: idNum }],
      });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        surname,
        idNum: idNum.trim(),
        course,
        email: email.trim(),
        verificationcode: Math.round(Math.random() * (999999 - 100000) + 100000),
      });

      const salt = await bcrypt.genSalt(8);

      user.password = await bcrypt.hash(password, salt);

      const transport = nodemailer.createTransport(
        sendGridTransport({
          auth: {
            api_key: nodemailerKey,
          },
        })
      );

      transport.sendMail({
        to: email,
        from: "noReply@emu.edu.tr",
        subject: "Email Verification",
        // headers: ,
        text:
          `Hi dear ${name} ${surname},\n\n` +
          "Please verify your email by clicking on the link below: \n" +
          user.verificationcode
      });

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async emailVerification(req, res) {
    try {
      const token = req.params.token;
      // If we found a token, find a matching user
      const user = await User.findOne({
        verificationcode: { $eq: token }
      }).select("-password");

      if (!user || user.verificationcode == null) {
        return res.status(406).json({ errors: [{ msg: "Invalid code" }] });
      }

      if (user.isverified) {
        return res.status(400).json({
          type: "already-verified",
          msg: "This user has already been verified.",
        });
      }

      user.isverified = true;
      user.verificationcode = null;

      await user.save();
      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async resendVerificatoinCode(req, res) {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(406).json({ errors: [{ msg: "We were unable to find a user with that email." }] });
      }

      if (user.isverified) {
        return res.status(406).json({ errors: [{ msg: "This account has already been verified. Please log in." }] });
      }

      user.verificationcode = Math.round(Math.random() * (999999 - 100000) + 100000);

      await user.save();

      const transport = nodemailer.createTransport(
        sendGridTransport({
          auth: {
            api_key: nodemailerKey,
          },
        })
      );

      transport.sendMail({
        to: user.email,
        from: "noReply@emu.edu.tr",
        subject: "Email Verification",
        // headers: ,
        text:
          `Hi dear ${user.name} ${user.surname},\n\n` +
          "Please verify your email by clicking on the link below: \n" +
          user.verificationcode
      });

      return res.json();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async sendPasswordResetToken(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email }).select("-password");

      if (!user) {
        return res.status(406).json({ errors: [{ msg: "We were unable to find a user with that email." }] });
      }

      user.passwordResetToken = Math.round(
        Math.random() * (999999 - 100000) + 100000
      );

      await user.save();

      const transport = nodemailer.createTransport(
        sendGridTransport({
          auth: {
            api_key: nodemailerKey,
          },
        })
      );

      transport.sendMail({
        from: "noReply@emu.edu.tr",
        to: user.email,
        subject: "Email Verification",
        text:
          `Hi dear ${user.name} ${user.surname},\n\n` +
          `Your reset password code is: ${user.passwordResetToken}`,
      });

      return res.json();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async verifyResetToken(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email }).select("-password");

      if (!user) {
        return res.status(406).json({ errors: [{ msg: "We were unable to find a user with that email." }] });
      }

      if (req.body.code === null)
        return res.status(406).json({ errors: [{ msg: "Invalid Code" }] });

      if (user.passwordResetToken.toString() !== req.body.code.toString())
        return res.status(406).json({ errors: [{ msg: "Invalid Code" }] });

      user.passwordResetToken = null;
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000000000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }

  static async resetPassword(req, res) {
    try {

      const user = await User.findOne({ email: req.user.email });

      if (!user) {
        return res.status(406).json({ errors: [{ msg: "We were unable to find a user with that email." }] });
      }

      const salt = await bcrypt.genSalt(8);

      user.password = await bcrypt.hash(req.body.password, salt);

      await user.save();

      return res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
};
