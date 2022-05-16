const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const database = require("./db");

// DB Models
const UserModel = require("./schemas/UserSchema");
const CodeModel = require("./schemas/CodeSchema");

// Helper Functions
const generateSecret = require("./utils/generateSecret");
const sendEmail = require("./utils/sendEmail");

const bcrypt = require("bcrypt");
const { authenticator } = require("otplib");
const jwt = require("jsonwebtoken");
const wrap = require("express-async-error-wrapper");

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// Middlewares
const verifyToken = require("./middlewares/verifyAuth");

const PORT = 8000;
app.listen(PORT, () => console.log(`Server listening on PORT = ${PORT}`));

// Sign Up Route
app.post(
  "/auth/sign-up/",
  wrap(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errorMessage: "User with the given email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    user = await new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      qrSecret: authenticator.generateSecret(32),
    }).save();

    let code = await new CodeModel({
      userId: user._id,
      code: generateSecret(16),
    }).save();

    try {
      await sendEmail(
        email,
        "2FA Verification Code",
        `
        <html>
          <body>
            Hello ${firstName},<br />
            Click the following link to verify your email: <a href="http://localhost:8000/auth/verify/${user._id}/${code.code}/">http://localhost:8000/auth/verify/${user._id}/${code.code}/</a>.
            If you didn't request this email, you can ignore this safely.<br />
            Note: This link will expire in 4 hours.
          </body>
        </html>
    `
      );
    } catch {
      res.status(500).json({
        errorMessage: "Something went wrong.",
      });
    }

    return res.status(200).json({
      successMessage:
        "An email has been sent to your account. Please verify your email to continue.",
    });
  })
);

// Verification Route
app.get(
  "/auth/verify/:userId/:verificationCode/",
  wrap(async (req, res) => {
    const userId = req.params.userId;
    const verificationCode = req.params.verificationCode;

    try {
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        return res.status(400).json({
          errorMessage: "Invalid verification link!",
        });
      }

      const code = await CodeModel.findOne({
        userId,
        code: verificationCode,
      });

      if (!code) {
        return res.status(400).json({
          errorMessage: "Invalid verification link!",
        });
      }

      await UserModel.updateOne({ _id: userId, verified: true });
      await CodeModel.findOneAndDelete({ _id: code._id });

      return res.status(200).json({
        successMessage: "Email verified successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        errorMessage: "Something went wrong.",
      });
    }
  })
);

// Sign In Route
app.post(
  "/auth/sign-in/one/",
  wrap(async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email,
    }).lean();

    if (!user) {
      return res.status(404).json({
        errorMessage: "We did not find any user account linked to that email.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        errorMessage: "Please verify your email to continue!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        errorMessage: "Incorrect credentials.",
      });
    }

    delete user.password;
    if (user.enabled2fa) {
      delete user.qrSecret;
    }
    user.qrSecret = authenticator.keyuri(
      "2FA Account",
      "2FA App",
      user.qrSecret
    );

    res.status(200).json({
      successMessage: "One of two steps of login completed.",
      userData: user,
      // qrSecret,
    });
  })
);

// QR Authentication
app.post(
  "/auth/sign-in/two/",
  wrap(async (req, res) => {
    const { email, password, code, rememberMe } = req.body;

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        errorMessage: "We did not find any user account linked to that email.",
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        errorMessage: "Please verify your email to continue!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        errorMessage: "Incorrect credentials.",
      });
    }

    if (!code) {
      res.status(400).json({
        errorMessage:
          "Please enter a six-digit secret code from the authenticator application on your mobile phone.",
      });
    }

    const isCodeValid = authenticator.verify({
      token: code,
      secret: user.qrSecret,
    });

    if (!isCodeValid) {
      res.status(400).json({
        errorMessage:
          "The two-factor authentication code is invalid. Please try again.",
      });
    }

    if (!user.enabled2fa) {
      await UserModel.updateOne({ _id: user._id, enabled2fa: true });
    }

    res.status(200).json({
      successMessage: "Two of two steps of login completed",
      token: jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        process.env.HASH_SECRET,
        rememberMe
          ? {}
          : {
              expiresIn: "2h",
            }
      ),
    });
  })
);

// Token Validation Route
app.get(
  "/",
  verifyToken,
  wrap(async (req, res) => {
    const user = await UserModel.findOne({
      _id: req.user._id,
      email: req.user.email,
    }).lean();

    delete user.password;
    delete user.qrSecret;

    res.status(200).json({
      successMessage: "The token is valid.",
      userData: user,
    });
  })
);
