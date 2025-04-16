// file: utils/gmailNotification.js

// Use the existing, working transporter from mailer.js
const transporter = require("./mailer");

/**
 * Sends an email to the well owner with their new sensor readings.
 *
 * @param {string} recipientEmail  – the user’s gmail (from UserTbl.gmail)
 * @param {number|string} salinity – the salinity_level value
 * @param {number|string} ph       – the ph_level value
 */
function sendGmailNotification(recipientEmail, salinity, ph) {
  if (!recipientEmail) {
    console.error("🚫 No recipient email provided for notification");
    return;
  }

  const mailOptions = {
    from: `"Blue Monitoring" <${process.env.GMAIL}>`,
    to: recipientEmail,
    subject: "New Well Data Submitted",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #007BFF;">Hello,</h2>
        <p>Your well data has been updated with the following readings:</p>
        <ul>
          <li><strong>Salinity Level:</strong> ${salinity} ppt</li>
          <li><strong>pH Level:</strong> ${ph}</li>
        </ul>
        <p>Please review and let us know if you have any questions.</p>
        <br/>
        <p style="color: #555;">Best regards,<br/>
        💧 <em>Blue Monitoring Team</em></p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("❌ Error sending well data notification:", err);
    } else {
      console.log("✅ Well data notification sent:", info.messageId);
    }
  });
}

module.exports = sendGmailNotification;
