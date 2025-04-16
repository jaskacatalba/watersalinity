const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

async function sendEmail(toEmail, subject, text) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"N&F Guest House" <${process.env.EMAIL}>`,
      to: toEmail,
      subject: subject,
      text: text,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}

module.exports = sendEmail;
