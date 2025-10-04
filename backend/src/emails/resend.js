import { resend } from "./resend.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplate.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import { WELCOME_EMAIL_TEMPLATE } from "./emailTemplate.js";

const sendVerificationEmail = async function (recipientEmail , otp) {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: `${recipientEmail}`,
            subject: 'Verify your account',
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",otp),
          });
          
           console.log( "Email sent successfully " , response );
           
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error };
    }
}

const sendPasswordResetEmail = async function (recipientEmail , resetURL) {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: `${recipientEmail}`,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
          });

          console.log( "Email sent successfully " , response );
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error };
    }
}

const sendPasswordSuccessEmail = async function (recipientEmail) {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: `${recipientEmail}`,
            subject: 'Password reset successfull',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
          });

          console.log( "Email sent successfully " , response );
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error };
    }
}

const sendWelcomeEmail = async function (recipientEmail,recipientName,websiteHomeUrl) {
    try {
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: `${recipientEmail}`,
            subject: `Welcome Email`,
            html: WELCOME_EMAIL_TEMPLATE.replaceAll(`{username}`,recipientName).replace(`{website-home-url}`,websiteHomeUrl),
          });

          console.log( "Email sent successfully " , response );
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error };
    }
}

export {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendPasswordSuccessEmail,
    sendWelcomeEmail
}