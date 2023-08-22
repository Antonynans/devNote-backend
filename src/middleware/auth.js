import jwt from "jsonwebtoken";

const config = process.env.JWT_SECRECT_KEY;

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt || req.headers["authorization"]?.split(" ");
  if (req.headers["authorization"]) {
    try {
      if (token[0] !== "Bearer") {
        return res.status(401).send();
      } else {
        jwt.verify(token[1], config, (err) => {
          return next();
        });
      }
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" });
  }
};

export default verifyToken;

