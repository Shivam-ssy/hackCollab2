import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyAuth = asyncHandler(async (req, res, next) => {
  // Your authentication logic here
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded?._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(401, "Invalid token");
  }
  req.user = user;
  next();
});

export default verifyAuth;
