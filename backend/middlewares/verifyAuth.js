const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(401)
      .json({ errorMessage: "A token is required for authentication." });
  }

  try {
    const decoded = jwt.verify(token, process.env.HASH_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ errorMessage: "Invalid token" });
  }

  return next();
};

module.exports = verifyToken;
