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

router.post("/signup",validator.signupvalidator(), (req,res) => {
    const errors = validationResult(req);
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

module.exports = router;