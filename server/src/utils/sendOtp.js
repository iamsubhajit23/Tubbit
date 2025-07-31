import nodemailer from "nodemailer";
import dotenv from "dotenv"

dotenv.config({
  path: "./.env"
})

const sendOtp = async (toEmail, otp, otpFor) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const otpDigits = otp.toString().split("").map(
    (digit) => `
    <td style="
      width: 40px;
      height: 50px;
      border: 2px solid #99f6e4;
      border-radius: 8px;
      text-align: center;
      font-size: 22px;
      font-weight: bold;
      color: #1f2937;
      background-color: #f0fdfa;
      font-family: Arial, sans-serif;
    ">
      ${digit}
    </td>`
  ).join("");

  const mailOptions = {
    from: `"Tubbit" <${process.env.MAIL_FROM}>`,
    to: toEmail,
    subject: `${otpFor === "signup"? "no-reply: Tubbit email verification OTP": "no-reply: Your RESET Password OTP"}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Tubbit - Email Verification</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px; line-height: 1.6; }
    .email-container { max-width: 576px; margin: 0 auto; background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
    .header { background: linear-gradient(to right, #0d9488, #14b8a6); padding: 24px 32px; text-align: center; color: white; }
    .company-name { font-size: 24px; font-weight: bold; letter-spacing: 0.05em; }
    .company-tagline { color: #99f6e4; font-size: 14px; }
    .main-content { padding: 32px; }
    .greeting h2 { font-size: 22px; color: #1f2937; margin-bottom: 16px; }
    .message { color: #4b5563; }
    .otp-container { display: flex; justify-content: center; gap: 16px; margin: 32px 0; }
    .otp-digit { width: 64px; height: 64px; background: linear-gradient(to bottom right, #f0fdfa, #ccfbf1); border: 2px solid #99f6e4; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #1f2937; }
    .expiry-notice { font-size: 14px; color: #6b7280; margin-bottom: 24px; text-align: center; }
    .signature { border-top: 1px solid #f3f4f6; padding-top: 24px; color: #4b5563; text-align: left; }
    .signature .team-name { color: #0d9488; font-weight: 600; }
    .footer { background-color: #f9fafb; padding: 24px 32px; text-align: center; font-size: 12px; color: #9ca3af; }
    .footer a { color: #0d9488; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="company-name">Tubbit</div>
      <div class="company-tagline">Stream. Create. Engage.</div>
    </div>

    <div class="main-content">
      <div class="greeting">
        <h2>Hi User,</h2>
        <div class="message">
          <p>${otpFor === "signup"? "Your verification OTP is:": "Your reset password OTP is:"}</p>
        </div>
      </div>

      <div class="otp-container">
        ${otpDigits}
      </div>

      <div class="expiry-notice">
        This OTP will expire in <strong>5 minutes</strong>.
      </div>

      <div class="signature">
        <p>Best Regards,</p>
        <p class="team-name">Tubbit Team</p>
      </div>
    </div>

    <div class="footer">
      <p>You're receiving this email because you signed up for Tubbit.</p>
      <p><a href="#">Privacy Policy</a> • <a href="#">Terms</a> • <a href="#">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Mail sending error :: ", error)
  }
};

export { sendOtp }