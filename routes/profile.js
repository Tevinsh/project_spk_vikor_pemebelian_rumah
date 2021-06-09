const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const app = require('../app');
const path = require('path');
const profile = require('../controllers/profileController');
const multer = require('multer');
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');


router.get("/",async (req,res)=>{
    let error = req.session.error;
    let result = await profile.profile(req,res);
    console.log(result);
    let pagetitle = "Profile";
    req.session.error = null;
    res.render("../views/pages/profile",{name :req.session.name, error: error, pagetitle:pagetitle,result:result,session:req.session});
})

router.post("/update",async (req,res)=>{;
    profile.profileUpdate(req,res);
    //res.json(req.body);
})

router.post('/upload', function (req, res) {
    files.name = req.session.name;  
    uploadAvatar(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          res.json(err);
        } else if (err) {
          res.json(err);
        }
        console.log(req.file);
        await profile.imgUpdate(req,res);
        res.redirect('/profile');
        // Everything went fine.
      })
    })




module.exports = router;