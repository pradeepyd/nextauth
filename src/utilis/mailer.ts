import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

interface sendemailInputs {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: sendemailInputs) => {
  try {
    
    const hashedToken = await bcrypt.hash(userId.toString(),10)
    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId,{
        verifyToken:hashedToken, verifyTokenExpiry:Date.now() + 3600000
      })
    }
    else if(emailType === "FORGOT"){
      await User.findByIdAndUpdate(userId,{
        forgotPasswordToken:hashedToken, forgotPasswordExpiray:Date.now() + 3600000
      })
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });

    const mailOptions = {
      from: "pradeep@yadav.ai",
      to: email,
      subject:
        emailType === "VERIFY" ? "verify your email" : "Reset your password",
      html: `<p> Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "Reset your password"} or copy and paste the link in your browser<br>
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("error");
  }
};
