import nodemailer from 'nodemailer'

interface sendemailInputs{
    email:string;
    emailType:string;
    userId:string;
}

export const sendEmail = async({email,emailType, userId}:sendemailInputs) => {
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
        from:'pradeep@yadav.ai',
        to: email,
        subject: emailType === "VERIFY" ? "verify your email":"forgot your password",
        html: "<b>Hello world?</b>", // html body
      }

      const mailResponse = await transporter.sendMail(mailOptions);
      return mailResponse;
}