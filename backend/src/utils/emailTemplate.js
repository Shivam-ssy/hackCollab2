export const getOtpEmailTemplate = ({ otp, isForPassword, userName = "User" }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isForPassword ? "Reset Password" : "Verify Email"}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 16px;
      }
      .otp-box {
        background: #f3f4f6;
        border: 1px dashed #4f46e5;
        text-align: center;
        padding: 16px;
        margin: 24px 0;
        border-radius: 6px;
        font-size: 28px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #4f46e5;
      }
      .footer {
        padding: 16px;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
        background: #fafafa;
      }
      .warning {
        color: #dc2626;
        font-size: 13px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>${isForPassword ? "Password Reset" : "Email Verification"}</h1>
      </div>

      <div class="content">
        <p>Hi ${userName},</p>

        <p>
          ${
            isForPassword
              ? "We received a request to reset your password. Use the OTP below to continue."
              : "Thank you for signing up! Please use the OTP below to verify your email address."
          }
        </p>

        <div class="otp-box">${otp}</div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p class="warning">
          If you did not request this, please ignore this email.
        </p>

        <p>Regards,<br /><strong>HackCollab Team</strong></p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} HackCollab. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
