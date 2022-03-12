const nodemailer = require('nodemailer');

const sendEmail = async (options) =>{
    // create a transport
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "8cc2adf995c9eb",
          pass: "d4e037a0437242"
        }
      });

    //Define the email options 

    const mailOptions = { 
        from: "admin@dude.com", 
        to: options.email, 
        subject: options.subject, 
        text: options.message
    }

    //send the email
    await transport.sendMail(mailOptions);
}

module.exports = sendEmail;