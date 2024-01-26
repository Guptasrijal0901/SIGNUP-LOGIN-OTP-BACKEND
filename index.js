const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
app.use(cookies());
require("dotenv").config();
const  connectDatabase  = require("./connection/db");
const generatetoken = require("./tokens/generate");
const verifytoken = require("./tokens/verify");
const USER_MODEL = require("./model/user");
const user = require("./model/user");
const { sendLoginOtp, verifyOtp } = require("./function/otp");
const { encrytPassword, verifyPassword } = require("./function/encryption");

const checkloggedinuser = (req, res , next )=>{
    if(verifytoken(req.cookies.auth_tk)){
        const userVERIFY = verifytoken(req.cookies.auth_tk);
        req.userEMAIL = userVERIFY.id;
        next();
    }else{
        return res.status(400).json({ success: false , error : "UNAUTHORIZED"})
    }
}
app.post("/signup" , async(req, res)=>{
    try {
        // console.log(req.body);
        const checkuser  = await USER_MODEL.findOne({ userEMAIL: req.body.userEMAIL})
        if (checkuser){
            return res.status(400).json({ success: false , error: "User already Exist"})
        }
        const newuser = new USER_MODEL({
            userEMAIL: req.body.userEMAIL ,
            userNAME: req.body.userNAME,
            userPASSWORD: await encrytPassword(req.body.userPASSWORD),
            userDOB: req.body.userDOB,
            userPHONENUMBER: req.body.userPHONENUMBER,
            userOCCUPATION: req.body.userOCCUPATION,
        })
        await newuser.save();
        const token = generatetoken(userEMAIL)
        res.cookie("auth_tk", token)
        return res.json ({ success: true , message: "Signed up success and token is generated"})
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({ success: false , error : error.message})
    }
})


app.post("/login" , async(req, res)=>{
    try {
        // console.log("This is from LOGIN api")
        let userEMAIL = req.body.userEMAIL;
        let inputpassword = req.body.userPASSWORD;
        const checkuser = await USER_MODEL.findOne({ userEMAIL : userEMAIL});
        if(!checkuser){
            return res.status(400).json({ success: false , error: "User not found, please SIGNUP first"})
        }
        // console.log(checkuser);
        let originalpassword = checkuser.userPASSWORD;
        
        if (await verifyPassword(inputpassword , originalpassword)){
            sendLoginOtp(`+91${checkuser.userPHONENUMBER}`)
            return res.json({ success: true , message: "Please enter OTP to login"})
        }else{
            return res.status(400).json
            ({ success : false , error : "INCORRECT PASSWORD ENTERED"})
        };
        console.log(inputpassword);
        console.log(originalpassword);
        // console.log(originalpassword);
        // return res.json({ success: true , message : "Hi from LOGIN"})
    } catch (error) {
        console.log(error);
        return res.json(400).json({ success: false , error : error.message})
    }
})

app.post("/mfaverify",  async (req, res) => {
    try {
      let userEMAIL = req.body.userEMAIL;
      let inputpassword = req.body.userPASSWORD;
      let code = req.body.code;
      const checkuser = await USER_MODEL.findOne
      ({ userEMAIL: userEMAIL });
      if (!checkuser) {
        return res
          .status(400)
          .json({ success: false, error: "User not found, please signup first" });
      }
      let originalpassword = checkuser.userPASSWORD;
  
      if (
        (await verifyPassword(inputpassword, originalpassword)) &&
        (await verifyOtp(`+91${checkuser.userPHONENUMBER}`, code))
      ) {
        const token = generatetoken(checkuser._id);
        res.cookie("auth_tk", token);
        return res.json({ success: true, message: "Logged in success" });
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Incorrect credentials" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  });


connectDatabase();
app.listen(5050, () => {
    console.log("Server is running on port 5050");
  });