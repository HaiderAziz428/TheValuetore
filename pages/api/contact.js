const nodemailer = require("nodemailer");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Email content
    const emailContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Message: ${message}

Submitted at: ${new Date().toLocaleString()}
    `;

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

    // Send email
    const info = await transporter.sendMail({
      from: "haideraziz428@gmail.com",
      to: "haideraziz428@gmail.com",
      subject: "New Contact Form Submission - The Value Store",
      text: emailContent,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `,
    });

    res.status(200).json({
      message: "Contact form submitted successfully and email sent",
      data: { name, email, phone, message },
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // More detailed error response
    if (error.code === "EAUTH") {
      return res.status(500).json({
        message: "Email authentication failed. Please check credentials.",
      });
    } else if (error.code === "ECONNECTION") {
      return res.status(500).json({
        message: "Email connection failed. Please try again later.",
      });
    } else {
      return res.status(500).json({
        message: "Failed to send email. Please try again later.",
        error: error.message,
      });
    }
  }
}
