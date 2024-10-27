const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  try {
    console.log("midddleware========================");
    const authHeader = req?.headers["authorization"];
    console.log("authorization===============>", authHeader);
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token missing" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log("err====================", err);
  }
}

module.exports = { authenticateToken };
