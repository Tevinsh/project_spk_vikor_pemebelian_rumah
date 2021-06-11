const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const admin = require('../controllers/adminController');
const app = require('../app');
const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');

router.get("/dashboard", async (req,res)=>{
    let pagetitle = "dashboard";  
    let error = null
    let session = req.session
    let result = await admin.dasbor(req,res);
    console.log(result);
    res.render("../views/pages/admin/dasbor",{pagetitle : pagetitle,error: error, name:session.name,session:req.session,result : result})
})

router.get("/kriteria", async (req,res)=>{
    let pagetitle = "kriteria";  
    let error = null
    let session = req.session
    let kriteria = await admin.rKriteria();
    res.render("../views/pages/admin/kriteria",{pagetitle : pagetitle,error: error, name:session.name,session:req.session,kriteria : kriteria})
})

router.get("/lihat", async (req,res)=>{
    let pagetitle = "lihat";  
    let error = null
    let session = req.session
    res.render("../views/pages/admin/lihat",{pagetitle : pagetitle,error: error, name:session.name,session:req.session})
})

router.get("/akun", async (req,res)=>{
    let pagetitle = "akun";  
    let error = null
    let session = req.session
    res.render("../views/pages/admin/akun",{pagetitle : pagetitle,error: error, name:session.name,session:req.session})
})

router.get("/delete:id", async (req, res) => {
    await admin.delete(req, res);
})



module.exports = router;