/*
|--------------------------------------------------------------------------
| Auth Controller
|--------------------------------------------------------------------------
| Handles complete user authentication and account management flow:
| - User registration with email verification (OTP-based)
| - Login with JWT access & refresh tokens
| - Secure cookie handling
| - Password reset via OTP
| - Profile management
| - Logout with token invalidation
|
| Includes security features like:
| - Email verification enforcement
| - OTP attempt limiting & temporary blocking
| - Refresh token storage & rotation
| - HTTP-only secure cookies
|--------------------------------------------------------------------------
*/



import User from "../models/user.model.js"
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { generateOTP, verifyOTP } from "../helpers/generteOtp.js";
import OTP from "../models/otp.model.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { logger } from "../loggers/logger.js";
import { sendOtpService, verifyOtpService } from "../services/otp.services.js";
import Role from "../models/role.model.js";



const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 2 * 60 * 60 * 1000,
};


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating the Tokens")
  }
}

export const sendOtp = asyncHandler(async (req, res, next) => {
  const { email, isForPassword } = req.body;
  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }
  const existedUser = await User.findOne({ email });
  if (!existedUser) {
    return next(new ApiError(400, "No user found with this email"))
  }
  if (existedUser.isEmailVerified && !isForPassword) {
    return next(new ApiError(409, "Email already verified"))
  }

  //creating the otp in database 
  const otp = await sendOtpService({ email, purpose: isForPassword ? "RESET_PASSWORD" : "EMAIL_VERIFY" })
  // send to user
  await sendEmail(existedUser.email, isForPassword, otp, existedUser.name);
  res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"))

})


export const verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp, purpose } = req.body;
  // console.log(`Verifying OTP for email: ${email}, purpose: ${purpose} ${otp}`);
  if (!email || !otp || !purpose) {
    return next(new ApiError(400, "Please provide correct otp"))
  }
  const record = await OTP.findOne({ email, purpose })
  if (!record) {
    return next(new ApiError(400, "OTP are either expired or invalid"))
  }
  if (record?.blockedUntil && record.blockedUntil > new Date()) {
    return next(new ApiError(400, "Currently BLocked"))
  }
  if (record.attempts >= 5) {
    record.blockedUntil = new Date(Date.now() + 10 * 60 * 1000);
    await record.save();
    return next(new ApiError(400, "TOO_MANY_ATTEMPTS"));
  }
  const isCorrect = verifyOTP(otp, record.otp)
  if (!isCorrect || purpose !== record.purpose) {
    return next(new ApiError(400, "OTP is invalid"))
  }
  await OTP.deleteOne({ email });
  return res.status(200).json(new ApiResponse(200, null, "Verified successfully"));
})

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  await verifyOtpService({
    email,
    otp,
    purpose: "EMAIL_VERIFY",
  });

  await User.updateOne({ email }, { isEmailVerified: true });

  res.status(200).json(new ApiResponse(200, null, "Email verified"));
});

// export const createUser = asyncHandler(async (req, res, next) => {
//   const { name, email, password, role } = req.body;
//   if (!name || !email || !password) {
//     return next(new ApiError(400, "Name, email and password are required"));
//   }
//   if (role == "admin") {
//     return next(new ApiError(400, "Role should not be admin"))
//   }
//   const existedUser = await User.findOne({ email });
//   if (existedUser) {
//     return next(new ApiError(409, "User already existed"));
//   }
//   const user = await User.create({ name, email, password, roles: role });
//   const createdUser = await User.findOne({ email: user.email }).select("-password -refreshToken");
//   if (!createdUser) {
//     return next(new ApiError(500, "Something went Wrong"))
//   }
//   // send otp for verification   
//   const otp = await sendOtpService({ email: createdUser.email, purpose: "EMAIL_VERIFY" })
//   await sendEmail(createdUser.email, false, otp, createdUser.name)

//   res.status(201).json(new ApiResponse(201, createdUser, "User created Successfully"));
// });


export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // ✅ Basic validation
  if (!name || !email || !password) {
    return next(new ApiError(400, "Name, email and password are required"));
  }

  // ❌ Prevent admin self signup
  if (role === "admin") {
    return next(new ApiError(400, "Role should not be admin"));
  }

  // ❌ Check existing user
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return next(new ApiError(409, "User already exists"));
  }

  // 🔥 Get role from DB
  const normalizedRole = role.toLowerCase();
  const roleDoc = await Role.findOne({ name: normalizedRole });

  if (!roleDoc) {
    return next(new ApiError(400, "Invalid role"));
  }

  const userData = {
    name,
    email,
    password,
    roles: [roleDoc._id], // ✅ RBAC fix
  };

  // 🔥 Multi-tenant (college only)
  if (role === "college") {
    const slug = await generateUniqueCollegeSlug(name, User);

    userData.collegeSlug = slug;
    userData.collegeProfile = { name };
  }

  // ✅ Create user
  const user = await User.create(userData);

  const createdUser = await User.findById(user._id)
    .select("-password -refreshToken")
    .populate("roles", "name"); // optional

  // 🔥 OTP
  const otp = await sendOtpService({
    email: createdUser.email,
    purpose: "EMAIL_VERIFY",
  });

  await sendEmail(createdUser.email, false, otp, createdUser.name);

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  console.log(email, password, "this is from login");

  if (!email || !password) {
    return next(new ApiError(400, "Email and password is required"))
  }
  const existedUser = await User.findOne({ email }).select("+password");
  if (!existedUser) {
    return next(new ApiError(404, "User not found with this email"))
  }
  if (!existedUser.isEmailVerified) {
    return next(new ApiError(403, "Please Verify you email first"))
  }
  const isPasswordCorrect = await existedUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return next(new ApiError(403, "Please enter a Valid password"))
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existedUser._id);
  const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken").populate("roles", "name");
  // console.log(accessToken);
   const formattedUser = {
    ...loggedInUser.toObject(),
    roles: loggedInUser.roles.map(r => r.name),
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: formattedUser,
          accessToken,
          refreshToken
        },
        "Login successful"
      )
    );
})

export const getCurrentUser = asyncHandler(async (req, res, next) => {
  const userId = req.user;

  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("roles", "name"); // 🔥 fetch role name only

  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  const formattedUser = {
    ...user.toObject(),
    roles: user.roles.map(r => r.name),
  };
  res.status(200).json(
    new ApiResponse(200, formattedUser, "User fetched successfully")
  );
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "User not found with this email"));
  }
  const otp = await sendOtpService({ email: user.email, purpose: "RESET_PASSWORD" });
  await sendEmail(user.email, true, otp, user.name);
  res.status(200).json(new ApiResponse(200, null, "OTP sent to your email for password reset"));
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return next(new ApiError(400, "Email, OTP and new password are required"));
  }
  await verifyOtpService({ email, otp, purpose: "RESET_PASSWORD" });
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError(404, "User not found with this email"));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const { name, email } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();
  const updatedUser = await User.findById(userId).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
export const logout = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .cookie("accessToken", null, { ...options, maxAge: 0 })
    .cookie("refreshToken", null, { ...options, maxAge: 0 })
    .json(new ApiResponse(200, null, "Logout successful"));
});
