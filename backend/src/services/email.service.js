import nodemailer from "nodemailer";
import config from "../config/config.js";

export const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: true,
  service: "gmail",
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

export const emailSender = async (toMail, subject, htmlText, textText = "") => {
  try {
    const info = await transporter.sendMail({
      from: config.SMTP_USER,
      to: toMail,
      subject: subject,
      text: textText,
      html: htmlText,
    });
    console.log("INFO:", info);
    return true;
  } catch (error) {
    console.error("Error while sending mail:", error);
    return false;
  }
};

export const sendVerificationOtp = async (email, otp) => {
  const subject = "Verify your Todo App email address";

  const htmlText = `
    <div style="
      margin: 0;
      padding: 40px 20px;
      background-color: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
    ">
      <div style="
        max-width: 520px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      ">

        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="
            margin: 0;
            font-size: 26px;
            color: #18181b;
          ">
            Todo App
          </h1>
        </div>

        <h2 style="
          margin: 0 0 16px;
          color: #18181b;
          font-size: 22px;
        ">
          Verify your email address
        </h2>

        <p style="
          margin: 0 0 20px;
          color: #52525b;
          font-size: 15px;
          line-height: 1.6;
        ">
          Thanks for creating an account with Todo App.
          Please use the verification code below to verify your email address.
        </p>

        <div style="
          margin: 30px 0;
          padding: 20px;
          background-color: #f4f4f5;
          border-radius: 8px;
          text-align: center;
        ">
          <p style="
            margin: 0 0 8px;
            color: #71717a;
            font-size: 13px;
          ">
            Your verification code
          </p>

          <div style="
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 8px;
            color: #18181b;
          ">
            ${otp}
          </div>
        </div>

        <p style="
          margin: 0 0 12px;
          color: #52525b;
          font-size: 14px;
          line-height: 1.6;
        ">
          This code will expire in <strong>10 minutes</strong>.
        </p>

        <p style="
          margin: 0 0 30px;
          color: #71717a;
          font-size: 13px;
          line-height: 1.6;
        ">
          If you didn't create an account with Todo App, you can safely
          ignore this email.
        </p>

        <div style="
          border-top: 1px solid #e4e4e7;
          padding-top: 20px;
          text-align: center;
        ">
          <p style="
            margin: 0;
            color: #a1a1aa;
            font-size: 12px;
          ">
            © Todo App. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  `;

  const textText = `
Todo App - Verify your email address

Thanks for creating an account with Todo App.

Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't create an account with Todo App, you can safely ignore this email.

© Todo App. All rights reserved.
  `;

  return emailSender(email, subject, htmlText, textText);
};
