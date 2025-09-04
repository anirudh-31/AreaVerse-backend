import fs from 'fs'
import path from 'path';
/**
 * Replace placeholders in template
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

export {
    getVerificationEmail
}
