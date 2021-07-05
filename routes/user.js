const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const dashboard = require('../controllers/dashboardController');
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const app = require('../app');
const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');

router.post("/login",(req, res) => {
    user.doLogin(req, res);  
  });

router.post("/signup",validator.signupvalidator(), async (req,res) => {
    const errors = await validationResult(req);
    console.log("error = "+ JSON.stringify(errors));
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log(extractedErrors);
      res.redirect("/dashboard");
    } else {
      console.log("do signup true")
        user.doSignup(req,res);
    }
    //login.doSignup(req, res);
   
})
router.get("/logout", (req,res)=>{
    req.session.destroy();
    res.redirect("/dashview");
})
router.get("/otp",(req,res)=>{
  let error = req.session.error;
  let pagetitle = "otp";
  req.session.error = null;
  let email = req.query.e;
  res.render("../views/pages/otpconfirm",{name :req.session.name, error: error, pagetitle:pagetitle,session:req.session,email : email});
})
router.post("/otp/verify",(req,res)=>{
  user.verifyOtp(req,res);
})

router.get("/reset",(req,res)=>{
  let error = req.session.error;
  let pagetitle = "reset password";
  req.session.error = null;
  let state = 1;
  res.render("../views/pages/resetpass",{name :req.session.name, error: error, pagetitle:pagetitle,session:req.session,state : state});
})

router.get("/reset/:email",(req,res)=>{
  let error = req.session.error;
  let pagetitle = "reset password";
  req.session.error = null;
  let state = 2;
  res.render("../views/pages/resetpass",{name :req.session.name, error: error, pagetitle:pagetitle,session:req.session,state : state,email : req.params.email});
})

router.post("/reset/send",validator.resetPassword(), async (req,res)=>{
  const errors = await validationResult(req);
    console.log("error = "+ JSON.stringify(errors));
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log(extractedErrors);
      res.redirect("/user/reset");
    } else {
      await user.resetPass(req,res);
    }
})

router.post("/reset/proses",validator.prosesResetPassword(), async (req,res)=>{
  const errors = await validationResult(req);
    console.log("error = "+ JSON.stringify(errors));
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log(extractedErrors);
      res.redirect("/user/reset");
    } else {
      await user.passUpdateNew(req,res).then(()=>{
        req.session.error = "sukses update password"
        res.redirect("/dashboard")});
    }
})

router.post("/agen/updatePassword",validator.updatePass(), async (req,res)=>{
  console.log("routes success")
  const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log(extractedErrors);
      res.redirect("/agen/akun");
    } else {
      await user.passUpdate(req,res).then(()=>{
        req.session.error = "sukses update password"
        res.redirect("/agen/akun")});
    }
})

router.post("/pembeli/updatePassword",validator.updatePass(), async (req,res)=>{
  console.log("routes success")
  const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log(extractedErrors);
      res.redirect("/pembeli/akun");
    } else {
      await user.passUpdate(req,res).then(()=>{
        req.session.error = "sukses update password"
        res.redirect("/pembeli/akun")});
    }
})

module.exports = router;