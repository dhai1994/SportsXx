import { asyncHandler } from "../Utils/asynchandler.js";
import { ApiError } from "../Utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
   
    console.log(" Incoming request for protected route...");
console.log(" Cookies:", req.cookies);
console.log(" Authorization Header:", req.headers.authorization);

  const token =req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "").trim();
      console.log(" Extracted token:", token)
console.log("Received token:", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized Request - Token Missing");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token - User Not Found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid or Expired Access Token");
  }
});

export { verifyJWT };