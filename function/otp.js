const TWILIO_SERVICE_ID = "VA4619e6f3abfcd8a694fc4211ac1c09d6"; //from the services->verify page
const TWILIO_ACCOUNT_ID = "AC31c6b51283270aed3df45834058a4cb9"; // account settings
const TWILIO_AUTH_TOKEN = "a8381a5b373dfaf9bde47aa6ac9e0650"; // account settings below

const client = require("twilio")(TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN);

const sendLoginOtp = (userPHONENUMBER) => {
  if (!userPHONENUMBER)
    return {
      succes: false,
      error: "Phone Number Missing",
    };

  client.verify
    .services(TWILIO_SERVICE_ID)
    .verifications.create({
      to: userPHONENUMBER,
      channel: "sms",
    })
    .then((verification) => {
      return {
        success: true,
        status: verification.status,
      };
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 60200)
        return {
          success: false,
          error: "Invalid Parameter",
        };
      else if (err.code === 60203)
        return {
          success: false,
          error: "Max Send attempts reached",
        };
      else if (err.code === 60212)
        return {
          success: false,
          error: "Too many concurrent requests for phone number",
        };
      else
        return {
          success: false,
          error: "Server Issue, Try Again Later!",
        };
    });
};

const verifyOtp = async (userPHONENUMBER, code) => {
  try {
    const verification_check = await client.verify
      .services(TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: userPHONENUMBER,
        code: code,
      });
    console.log(verification_check.status);
    if (verification_check.status === "approved") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = { sendLoginOtp , verifyOtp};