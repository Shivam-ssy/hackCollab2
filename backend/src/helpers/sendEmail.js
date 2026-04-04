import nodemailer from 'nodemailer';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { getOtpEmailTemplate } from '../utils/emailTemplate.js';
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export const sendEmail = async (recipient, isForPassword, otp, userName) => {
    if (!recipient) {
        throw new ApiError(400, "Recipient email is required");
    }
    console.log( 
        process.env.EMAIL_USER,
    process.env.EMAIL_PASS
    );
    
    try {
        await transporter.sendMail({
            to: recipient,
            from: `HackCollab <${process.env.EMAIL_USER}>`,
            subject: isForPassword ? "Reset Your Password" : "Verify Your Email",
            html: getOtpEmailTemplate({
                otp,
                isForPassword,
                userName, // optional
            }),
        });

    } catch (error) {
        console.log(error);
        
        throw new ApiError(500, "Email not sent");
    }
}
