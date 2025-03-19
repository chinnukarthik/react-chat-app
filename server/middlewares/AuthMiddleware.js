import jwt from "jsonwebtoken";
// To maintain and verify token through jwt
export const verifyToken = (request, response, next) => {
  const token = request.cookies.jwt;
  if (!token) return response.status(401).send("You are not authenticated.");
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return response.status(403).send("Token is not valid");
    request.userId = payload.userId;
    next();
  });
};
