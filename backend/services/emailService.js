// backend/services/emailService.js

const nodemailer = require('nodemailer');

// --- CRITICAL FIX: Changed 'token' to 'verificationUrl' ---
const sendVerificationEmail = async (email, verificationUrl) => {
    try {
        // 1. Create a transporter with explicit settings
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER, // Your email address from .env
                pass: process.env.EMAIL_PASS, // Your 16-digit app password from .env
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // 2. Define the email options
        const mailOptions = {
            from: `"LegalLink Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Please Verify Your Email for LegalLink',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Welcome to LegalLink!</h2>
                    <p>Thank you for registering. Please click the button below to verify your email address.</p>
                    <a 
                        href="${verificationUrl}"  // <-- CRITICAL FIX: Use the full URL
                        style="background-color: #0A2342; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;"
                    >
                        Verify My Email
                    </a>
                    <p>This link will expire in 1 hour.</p>
                </div>
            `,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', email);

    } catch (error) {
        console.error('--- ERROR SENDING EMAIL ---:', error);
        throw new Error('Email could not be sent due to a server configuration error.');
    }
};

module.exports = { sendVerificationEmail };