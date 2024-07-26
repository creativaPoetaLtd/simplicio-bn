import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (email, username, resetPasswordLink) => {
  console.log("Transporter", transporter);
  await transporter.sendMail({
    from: "kananura221023924@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `<section style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
    <header style="text-align: center;">
        <a href="#">
            <img style="width: auto; height: 56px; margin-bottom: 16px;" src="https://i.imgur.com/5BWaV9X.png" alt="">
        </a>
    </header>

    <main style="margin-top: 32px;">
        <h2 style="color: #374151; font-size: 24px;">Hi ${username},</h2>

        <p style="margin-top: 16px; line-height: 1.6; color: #4b5563;">
            admin user has invited you to reset your password on <span style="font-weight: 600;">qiewcode</span>.
        </p>
        
        <a href="${resetPasswordLink}" style="display: inline-block; padding: 8px 24px; margin-top: 24px; font-size: 14px; font-weight: 500; text-decoration: none; color: #ffffff; background-color: #235552; border-radius: 4px; transition: background-color 0.3s ease-in-out;">Reset Password</a>
        
        <p style="margin-top: 32px; line-height: 1.6; color: #4b5563;">
            Thanks, <br>
            qiewcode team
        </p>
    </main>
    

    <footer style="margin-top: 32px;">
        <p style="color: #6b7280; line-height: 1.6;">
            This email was sent to <a href="#" style="color: #3b82f6; text-decoration: underline;">${email}</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" style="color: #3b82f6; text-decoration: underline;">unsubscribe</a> or <a href="#" style="color: #3b82f6; text-decoration: underline;">manage your email preferences</a>.
        </p>

        <p style="margin-top: 12px; color: #6b7280; line-height: 1.6;">© ${new Date().getFullYear()} qiewcode. All Rights Reserved.</p>
    </footer>
</section>`,
  });
};



export const sendWelcomeEmail = async (email, username) => {
  await transporter.sendMail({
    from: "kananura221023924@gmail.com",
    to: email,
    subject: "Welcome to qiewcode!",
    html: `<section style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
      <header style="text-align: center;">
        <a href="#">
          <img style="width: auto; height: 56px; margin-bottom: 16px;" src="https://i.imgur.com/5BWaV9X.png" alt="qiewcode Logo">
        </a>
      </header>
      <main style="margin-top: 32px;">
        <h2 style="color: #374151; font-size: 24px;">Hi ${username},</h2>
        <p style="margin-top: 16px; line-height: 1.6; color: #4b5563;">
          Thank you for creating an account with <span style="font-weight: 600;">qiewcode</span>.
        </p>
        <p style="margin-top: 16px; line-height: 1.6; color: #4b5563;">
          We are currently reviewing your account and will contact you shortly. Please wait for our further instructions.
        </p>
        <p style="margin-top: 32px; line-height: 1.6; color: #4b5563;">
          Thanks, <br>
          The qiewcode Team
        </p>
      </main>
      <footer style="margin-top: 32px;">
        <p style="color: #6b7280; line-height: 1.6;">
          This email was sent to <a href="#" style="color: #3b82f6; text-decoration: underline;">${email}</a>.
          If you didn't create this account, please ignore this email or contact support.
        </p>
        <p style="margin-top: 12px; color: #6b7280; line-height: 1.6;">© ${new Date().getFullYear()} qiewcode. All Rights Reserved.</p>
      </footer>
    </section>`,
  });
};