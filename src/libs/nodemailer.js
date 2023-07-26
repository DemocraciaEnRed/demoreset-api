import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: process.env.NODEMAILER_SECURE,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD
  }
})

export const sendEmail = (email, token) => {
  const mailData = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Account Validation Required - DemoReset',
    // place url of the organization for the image
    html: `<center><img src="${process.env.MAILS_LOGO}"></img></center> <br>
    Thank you for creating an account in <b>DemoReset</b>. To complete the registration process, we need to verify your email address. <br>
      Please click on the following link to validate your account:
      <a href="${process.env.FRONT_URL}/auth/validate/${token}">Validate account</a> <br>
      If you're having trouble accessing the link, you can copy and paste it into your browser's address bar. <br>
      Once you've validated your account, you'll be able to login and start collaborating. <br>
      Best regards, <br>
      <b>DemoReset</b>.`
  }

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log(err)
      return err
    }
    console.log(info)
    return info
  })
}

export const sendEmailRecoveryPassword = (email, token, first_name, last_name) => {
  const mailData = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Recover Password - DemoReset',
    html: `<center><img src="${process.env.MAILS_LOGO}"></img></center> <br>
    Dear ${first_name} ${last_name}, <br>
    We have received a request to reset your password for your account with us. To complete the process, please click on the following link: <a href="${process.env.FRONT_URL}/auth/forgotpassword/${token}">Recover Password</a> <br>
    If you did not request a password reset, please disregard this email. Your account will remain secure and your password will not be changed. <br>
    If you experience any issues with the link, please copy and paste it into your browser's address bar. After clicking on the link, you will be prompted to create a new password. <br>
    For security reasons, we recommend that you choose a strong password, containing at least 6 characters, including uppercase and lowercase letters, numbers, and symbols.
    If you have any questions or concerns, please do not hesitate to contact our support team. <br>
    Best regards, <br>
    <b>DemoReset</b>.
    `
  }

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log(err)
      return err
    }
    console.log(info)
    return info
  })
}

export const sendEmailPasswordChanged = (email, first_name, last_name) => {
  const mailData = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Password Changed - DemoReset',
    html: `<center><img src="${process.env.MAILS_LOGO}"></img></center> <br>
    Dear ${first_name} ${last_name}, <br>
    This email is to notify you that the password change of your account with us was successful. <br>
    If it was not you, or you have any problems accessing your account, please contact our support team. <br>
    Best regards, <br>
    <b>DemoReset</b>.
    `
  }

  transporter.sendMail(mailData, (err, info) => {
    if (err) {
      console.log(err)
      return err
    }
    console.log(info)
    return info
  })
}