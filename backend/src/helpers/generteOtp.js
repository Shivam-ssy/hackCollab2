import crypto from "crypto";

export const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000).toString();

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  return { otp, hashedOtp };
};

export const verifyOTP = (userOtp, storedHashedOtp) => {
  if (!userOtp || !storedHashedOtp) return false;

  const hashedUserOtp = crypto
    .createHash("sha256")
    .update(userOtp)
    .digest("hex");

  return hashedUserOtp === storedHashedOtp;
};
