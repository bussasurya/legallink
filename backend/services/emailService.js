// backend/services/emailService.js

const nodemailer = require('nodemailer');

// Note: We accept 'verificationUrl' here, not just 'token'.
// This allows auth.js to pass the correct production URL from the .env file.
const sendVerificationEmail = async (email, verificationUrl) => {
    try {
        // 1. Create a transporter with explicit SSL and Timeouts for Render
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // Use SSL
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            // --- CRITICAL FIX FOR RENDER TIMEOUTS ---
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 5000,    // 5 seconds
            socketTimeout: 10000      // 10 seconds
        });

        // 2. Define the email options
        const mailOptions = {
            from: `"LegalLink Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Email - LegalLink',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #0A2342; text-align: center;">Welcome to LegalLink!</h2>
                    <p style="color: #333; font-size: 16px;">Thank you for registering. Please verify your email address to activate your account.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" style="background-color: #D4AF37; color: #0A2342; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">Verify Email Address</a>
                    </div>
                    
                    <p style="color: #555; font-size: 14px;">Or copy and paste this link into your browser:</p>
                    <p style="background-color: #f4f4f4; padding: 10px; word-break: break-all; font-size: 12px; color: #555;">${verificationUrl}</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">If you did not request this, please ignore this email.</p>
                </div>
            `,
        };

        // 3. Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to: ${email}`);

    } catch (error) {
        console.error('--- ERROR SENDING EMAIL ---:', error);
        // We throw the error so the API route knows it failed
        throw new Error('Email could not be sent due to a server configuration error.');
    }
};

module.exports = { sendVerificationEmail };