import fs from 'fs'
import path from 'path';

/**
 * Fucntion to create the verification email.
 * @param {string} template HTML template
 * @param {object} data { userName, companyName, logoUrl, verificationLink, verificationCode, supportEmail, unsubscribeLink }
 */
function getVerificationEmail(data) {
    let __dirname = path.resolve(path.dirname(''));
    let emailTemplate = fs.readFileSync(
        path.join(path.resolve(path.dirname('')), 'src' ,'assets', 'verification_email_template.html'),
        'utf-8'
    );
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        emailTemplate = emailTemplate.replace(regex, data[key]);
    });
    return emailTemplate;
}

/**
 * Fucntion to create the password reset email.
 * @param {string} template HTML template
 * @param {object} data { userName, companyName, logoUrl, resetLink, supportEmail, unsubscribeLink }
 */
function getPassowordResetEmail(data) {
    let emailTemplate = fs.readFileSync(
        path.join(path.resolve(path.dirname('')), 'src' ,'assets', 'password_reset_email.html'),
        'utf-8'
    );
    Object.keys(data).forEach((key) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        emailTemplate = emailTemplate.replace(regex, data[key]);
    });
    return emailTemplate;
}


export {
    getVerificationEmail,
    getPassowordResetEmail
}
