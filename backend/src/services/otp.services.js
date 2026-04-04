import OTP from "../models/otp.model.js";
import { generateOTP, verifyOTP } from "../helpers/generteOtp.js";
import ApiError from "../utils/ApiError.js";

const OTP_CONFIG = {
  maxAttempts: 5,
  blockDuration: 10 * 60 * 1000,
  resendCooldown: 60 * 1000,
  expireTime: 5 * 60 * 1000,
};

export const sendOtpService = async ({ email, purpose }) => {  
  // console.log(`this is form service ${email} ${purpose}`);
  
  const { otp, hashedOtp } = generateOTP();
  const now = Date.now();

  const existing = await OTP.findOne({ email, purpose });

 if (existing?.blockedUntil && existing.blockedUntil > new Date()) {
    throw new ApiError(429, "OPT are temporarly bloked on this email please try after some time");
  }
  if (existing?.resendAt > new Date()) {
    throw new ApiError(429, "Please wait before requesting new OTP");
  }

  await OTP.findOneAndUpdate(
    { email, purpose },
    {
      otp: hashedOtp,
      attempts: 0,
      blockedUntil: null,
      resendAt: new Date(now + OTP_CONFIG.resendCooldown),
      expireAt: new Date(now + OTP_CONFIG.expireTime),
    },
    { upsert: true }
  );

  return otp;
};

export const verifyOtpService = async ({ email, otp, purpose }) => {
  const record = await OTP.findOne({ email, purpose });

  if (!record) throw new ApiError(400, "OTP expired or invalid");

  if (record.expireAt < new Date()) {
    await OTP.deleteOne({ email, purpose });
    throw new ApiError(400, "OTP expired");
  }

  if (record.blockedUntil > new Date()) {
    throw new ApiError(429, "OTP blocked");
  }

  if (record.attempts >= OTP_CONFIG.maxAttempts) {
    record.blockedUntil = new Date(Date.now() + OTP_CONFIG.blockDuration);
    await record.save();
    throw new ApiError(429, "Too many attempts");
  }

  if (!verifyOTP(otp, record.otp)) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  await OTP.deleteOne({ email, purpose });
  return true;
};

export const verifyOtpHelper = async ({ email, otp, purpose }) => {
  if (!email || !otp || !purpose) {
    throw new ApiError(400, "Email, OTP and purpose are required");
  }

  const allowedPurposes = ["EMAIL_VERIFY", "RESET_PASSWORD", "PHONE_VERIFY"];
  if (!allowedPurposes.includes(purpose)) {
    throw new ApiError(400, "Invalid OTP purpose");
  }

  const record = await OTP.findOne({ email, purpose });
  if (!record) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  if (record.blockedUntil && record.blockedUntil > new Date()) {
    throw new ApiError(400, "Too many attempts, try later");
  }

  const isCorrect = verifyOTP(otp, record.otp);

  if (!isCorrect) {
    record.attempts += 1;

    if (record.attempts >= 5) {
      record.blockedUntil = new Date(Date.now() + 10 * 60 * 1000);
    }

    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  await OTP.deleteOne({ _id: record._id });
  return true;
};
