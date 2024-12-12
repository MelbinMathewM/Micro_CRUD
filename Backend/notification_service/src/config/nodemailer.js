import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email
const sendEmailNotification = async (recipient, subject, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipient,
      subject: subject,
      text: message,
    };

    console.log(process.env.EMAIL_PASS,'llll',process.env.EMAIL_USER);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (err) {
    console.error('Error sending email:', err.message);
  }
};

export default sendEmailNotification;
