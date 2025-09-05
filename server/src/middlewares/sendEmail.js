import { getPassowordResetEmail, getVerificationEmail } from "../utils/createEmail.js";
import path from 'path';
import nodemailer from 'nodemailer';

/**
 * Function to send verification email to the user.
 * @param {object} options
 * @param {string} options.to Recipient email
 * @param {string} options.userName User's name
 * @param {string} options.verificationLink Verification URL
 * @param {string} options.verificationCode Verification code
 */
async function sendVerificationEmail({ to, userName, verificationLink, verificationCode }) {
    const companyName     = process.env.APP;
    const logoUrl         = path.join(path.resolve(path.dirname('')), 'src', 'assets', 'logo.png');
    const supportEmail    = 'support@example.com';
    const unsubscribeLink = 'https://example.com/unsubscribe';

    const htmlContent = getVerificationEmail({
        user_name         : userName,
        company_name      : companyName,
        logo_url          : logoUrl,
        verification_link : verificationLink,
        support_email     : supportEmail,
        unsubscribe_link  : unsubscribeLink,
        verification_code : verificationCode
    });
    
    let textContent = 'Hi'
    const mailOptions = {
        from: `"${companyName}" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${companyName} - Verify your email`,
        text: textContent,
        html: htmlContent,
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err;
    }
}

/**
 * Function to send a password reset email to the user.
 * @param {object} options
 * @param {string} options.to Recipient email
 * @param {string} options.userName User's name
 * @param {string} options.verificationLink Verification URL
 * @param {string} options.verificationCode Verification code
 */
async function sendPasswordResetEmail({ to, userName, resetLink }) {
    const companyName     = process.env.APP;
    const logoUrl         = path.join(path.resolve(path.dirname('')), 'src', 'assets', 'logo.png');
    const supportEmail    = 'support@example.com';
    const unsubscribeLink = 'https://example.com/unsubscribe';

    const htmlContent = getPassowordResetEmail({
        user_name         : userName,
        company_name      : companyName,
        logo_url          : logoUrl,
        reset_link        : resetLink,
        support_email     : supportEmail,
        unsubscribe_link  : unsubscribeLink,
    });
    
    let textContent = 'Hi'
    const mailOptions = {
        from: `"${companyName}" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${companyName} - Password Reset request`,
        text: textContent,
        html: htmlContent,
    };

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        throw err;
    }
}

export { 
    sendVerificationEmail,
    sendPasswordResetEmail
 };