import nodemailer from "nodemailer";


import multer from 'multer';
import path from 'path';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Typically 587 or 465 for secure connections
  secure: false, // true for 465, false for other ports
  auth: {
    user: "kotav0835@gmail.com",
    pass: "juem ilmt dhqs wddi",
  },
});

// Function to send birthday notification to the birthday user
export const sendBirthdayNotification = async (user) => {
  try {
    const mailOptions = {
      from: "kotav0835@gmail.com",
      to: user.email,
      subject: "Happy Birthday!",
      text: `Happy Birthday, ${user.name}!`,
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent:", response);
  } catch (error) {
    console.log(error, "email sent");
  }
};

export const sendOtherBirthdayNotification = async (
  birthdayUser,
  otherUser
) => {
  try {
    // Prepare the email content
    const mailOptions = {
      from: "your-email@example.com",
      to: otherUser.email,
      subject: `Reminder: ${birthdayUser.name}'s Birthday`,
      text: `${birthdayUser.name} has a birthday today. Don't forget to wish them!`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

// Function to send anniversary notification

export const sendAnniversaryNotification = async (
  user,
  maleName,
  femaleName
) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: user.email,
    subject: "Happy Anniversary!",
    text: `Dear ${user.name},\n\nWishing you a very happy wedding anniversary, ${maleName} & ${femaleName}.\n\nBest wishes,\nYour Company`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Anniversary notification sent to ${user.email}`);
  } catch (error) {
    console.error(
      `Error sending anniversary notification to ${user.email}:`,
      error
    );
  }
};

export const sendGeneralWishesNotification = async (user, message) => {
  try {
    // Email options
    const mailOptions = {
      from: "kotav0835@gmail.com", // Sender address
      to: user.email, // Recipient's email
      subject: "Reminder: Don't Forget to Wish a Happy Wedding Anniversary!", // Subject line
      text: message, // Plain text body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`General wishes email sent to: ${user.email}`);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
  }
};



// Configure multer to save uploaded files
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  fileFilter: function (req, file, cb) {
    // Accept only CSV files
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

