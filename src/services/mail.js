import nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET,
    refreshToken: process.env.MAIL_REFRESH_TOKEN,
  },
});

export const sendMail = async (params) => {
  let mailOptions = {
    from: 'DevNote',
    to: params.to,
    subject: "Email verification ",
    html: `
    <div class="container" style="max-width: 90%, margin: auto; padding-top: 20px">
    <h1>DevNote</h1> <br /><br />
    <h2>Verify Email </h2><br /><br />
    <p>DevNote received a request to create an account for you. Before we proceed, we need you to verify the email address you provided. To verify your account, please copy the following code and enter it on the registration page: <br />
    Email Address Verification Code: ${params.OTP} <br />
    If you did not register with DevNote, please ignore this message as it's possible that someone else entered your email address by mistake.<br /><br />
    Kind Regards,<br />
    The DevNote Team
    </p>
    </div>`,
  };
  try {
    let info = await transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
    return info;
  } catch (error) {
    console.log("error ", error);
    return false;
  }
};
