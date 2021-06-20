const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const admin = require('../controllers/adminController');
const app = require('../app');
const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');

router.get("/dashboard", async (req,res)=>{
    if(req.session.user_type == "admin"){
    let pagetitle = "dashboard";  
    let error = req.session.error
    req.session.error = null
    let session = req.session
    let result = await admin.dasbor(req,res);
    console.log(result);
    res.render("../views/pages/admin/dasbor",{pagetitle : pagetitle,error: error, name:session.name,session:req.session,result : result})
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/kriteria", async (req,res)=>{
    if(req.session.user_type == "admin"){
    let pagetitle = "kriteria";  
    let error = req.session.error
    req.session.error = null
    let session = req.session
    let kriteria = await admin.rKriteria();
    res.render("../views/pages/admin/kriteria",{pagetitle : pagetitle,error: error, name:session.name,session:req.session,kriteria : kriteria})
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/lihat", async (req,res)=>{
    if(req.session.user_type == "admin"){
    let pagetitle = "lihat";  
    let error = req.session.error
    req.session.error = null
    let session = req.session
    res.render("../views/pages/admin/lihat",{pagetitle : pagetitle,error: error, name:session.name,session:req.session})
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/akun", async (req,res)=>{
    if(req.session.user_type == "admin"){
    let pagetitle = "akun";  
    let error = req.session.error
    req.session.error = null
    let session = req.session
    res.render("../views/pages/admin/akun",{pagetitle : pagetitle,error: error, name:session.name,session:req.session})
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/delete:id", async (req, res) => {
    if(req.session.user_type == "admin"){
    await admin.delete(req, res);
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.post("/ckriteria" , validator.postKriteria(),async (req,res)=>{
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      res.redirect("/admin/kriteria");
    } else {
      await admin.cKriteria(req,res);
    res.redirect('/admin/kriteria');
    }
  })



module.exports = router;