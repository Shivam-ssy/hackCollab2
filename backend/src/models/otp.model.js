import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        otp: {
            type: String, // hashed OTP
            required: true,
        },
        purpose: {
            type: String,
            enum: ["EMAIL_VERIFY", "RESET_PASSWORD", "PHONE_VERIFY"],
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        resendAt: {
            type: Date,
            required: true,
        },
        expireAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // TTL
        },
        blockedUntil: {
            type: Date,
            default: null,
        }
    },
    { timestamps: true }
);
const OTP = mongoose.model("otp", otpSchema);
export default OTP
