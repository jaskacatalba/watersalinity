require("dotenv").config();
const nodemailer = require("nodemailer");

// 🔧 Configure Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

/**
 * 📧 Sends a personalized registration email to a new user
 */
async function sendRegistrationEmail(recipientEmail, fullName, username, password) {
  try {
    const info = await transporter.sendMail({
      from: `"Blue Monitoring" <${process.env.GMAIL}>`,
      to: recipientEmail,
      subject: "Welcome to Blue Salinity Monitoring!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007BFF;">Hello ${fullName},</h2>
          <p>Thank you for registering. Your account has been successfully created!</p>

          <h3 style="color: #007BFF;">📌 Your Login Details:</h3>
          <ul>
            <li><strong>Username:</strong> ${username}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>

          <h3 style="color: #007BFF;">🌊 Why Water Monitoring Matters:</h3>
          <p>
            Monitoring salinity and pH levels helps ensure safe water, early pollution detection,
            and sustainable community protection. Thank you for being part of the Blue initiative!
          </p>

          <p style="color: #555;">💧 <em>Blue Monitoring Team</em></p>
        </div>
      `,
    });

    console.log("✅ Registration email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error sending registration email:", err);
    throw err;
  }
}

/**
 * 🚨 Sends a sensor alert email to the user about salinity and pH level changes
 */
async function sendSensorAlertEmail(recipientEmail, salinity, ph) {
  try {
    const info = await transporter.sendMail({
      from: `"Blue Monitoring Alert" <${process.env.GMAIL}>`,
      to: recipientEmail,
      subject: "📡 Water Quality Update from Blue Monitoring",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007BFF;">📡 New Sensor Data Recorded</h2>
          <p>The following water quality readings have been captured:</p>
          <ul>
            <li><strong>Salinity Level:</strong> ${salinity}</li>
            <li><strong>pH Level:</strong> ${ph}</li>
          </ul>

          <p>Please log in to your dashboard for a detailed report.</p>
          <br/>
          <p style="color: #555;">💧 <em>Blue Monitoring Team</em></p>
        </div>
      `,
    });

    console.log("✅ Sensor alert email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Error sending sensor alert email:", err);
    throw err;
  }
}

module.exports = {
  sendRegistrationEmail,
  sendSensorAlertEmail,
};
