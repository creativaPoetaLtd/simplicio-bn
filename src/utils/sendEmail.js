import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (email, username, resetPasswordLink) => {
  console.log("resetPasswordlInk", resetPasswordLink);
  await transporter.sendMail({
    from: "kananura221023924@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `<section style="max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
    <header style="text-align: center;">
        <a href="#">
            <img style="width: auto; height: 56px; margin-bottom: 16px;" src="https://i.imgur.com/fx1xkZq.jpeg" alt="">
        </a>
    </header>

    <main style="margin-top: 32px;">
        <h2 style="color: #374151; font-size: 24px;">Hi ${username},</h2>

        <p style="margin-top: 16px; line-height: 1.6; color: #4b5563;">
            admin user has invited you to reset your password on <span style="font-weight: 600;">Simplicio</span>.
        </p>
        
        <a href="${resetPasswordLink}" style="display: inline-block; padding: 8px 24px; margin-top: 24px; font-size: 14px; font-weight: 500; text-decoration: none; color: #ffffff; background-color: #235552; border-radius: 4px; transition: background-color 0.3s ease-in-out;">Reset Password</a>
        
        <p style="margin-top: 32px; line-height: 1.6; color: #4b5563;">
            Thanks, <br>
            Simplicio team
        </p>
    </main>
    

    <footer style="margin-top: 32px;">
        <p style="color: #6b7280; line-height: 1.6;">
            This email was sent to <a href="#" style="color: #3b82f6; text-decoration: underline;">${email}</a>. 
            If you'd rather not receive this kind of email, you can <a href="#" style="color: #3b82f6; text-decoration: underline;">unsubscribe</a> or <a href="#" style="color: #3b82f6; text-decoration: underline;">manage your email preferences</a>.
        </p>

        <p style="margin-top: 12px; color: #6b7280; line-height: 1.6;">© ${new Date().getFullYear()} Simplicio. All Rights Reserved.</p>
    </footer>
</section>`,
  });
};
