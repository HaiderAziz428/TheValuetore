const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "haideraziz428@gmail.com",
        pass: "dkgm jbgu xuww wflm",
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("Email configuration is valid");

    // Send test email
    const info = await transporter.sendMail({
      from: "haideraziz428@gmail.com",
      to: "haideraziz428@gmail.com",
      subject: "Test Email - Contact Form Setup",
      text: "This is a test email to verify the contact form email configuration is working correctly.",
      html: "<h2>Test Email</h2><p>This is a test email to verify the contact form email configuration is working correctly.</p>",
    });

    console.log("Test email sent:", info.messageId);

    res.status(200).json({
      message: "Test email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Test email error:", error);

    if (error.code === "EAUTH") {
      return res.status(500).json({
        message: "Email authentication failed. Please check credentials.",
        error: error.message,
      });
    } else if (error.code === "ECONNECTION") {
      return res.status(500).json({
        message: "Email connection failed. Please try again later.",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        message: "Failed to send test email.",
        error: error.message,
      });
    }
  }
}
