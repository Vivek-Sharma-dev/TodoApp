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


export const emailSender = async ( toMail , subject , htmlText , textText = "" ) => {
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