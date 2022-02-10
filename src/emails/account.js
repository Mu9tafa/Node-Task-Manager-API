const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
   sgMail
      .send({
         to: email, // Change to your recipient
         from: "mu9tafa.805@gmail.com", // Change to your verified sender
         subject: "Thanks for joining in",
         text: `Welcome to the app, ${name}`,
         html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      })
      .then(() => {
         console.log("Email sent");
      })
      .catch((error) => {
         console.error(error);
      });
};

const sendCancelationEmail = (email, name) => {
   sgMail
      .send({
         to: email, // Change to your recipient
         from: "mu9tafa.805@gmail.com", // Change to your verified sender
         subject: "Sorry to see you go!",
         text: `Goodbye, ${name}`,
         html: "<strong>and easy to do anywhere, even with Node.js</strong>",
      })
      .then(() => {
         console.log("Email sent");
      })
      .catch((error) => {
         console.error(error);
      });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail };
