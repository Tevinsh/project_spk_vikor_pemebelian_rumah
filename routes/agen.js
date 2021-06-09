const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const agen = require('../controllers/agenController')
const app = require('../app');
const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');

router.get("/dashboard", async (req,res)=>{
    let pagetitle = "agen";  
    let error = null
    let name = req.session.name
    res.render("../views/pages/agen/dasbor",{pagetitle : pagetitle,error: error, name:name,session:req.session})
})

router.get("/rumah", async (req,res)=>{
    let pagetitle = "rumah";  
    let error = null
    let name = req.session.name
    let kriteria = await agen.getKriteria();
    res.render("../views/pages/agen/manajemenrumah",{pagetitle : pagetitle,error: error, name:name,kriteria : kriteria,session:req.session})
})

router.get("/lihat", async (req,res)=>{
    let pagetitle = "lihat";  
    let error = null
    let name = req.session.name
    let rumah = await agen.getAgenRumah(req,res);
    console.log(rumah.imgPath);
    res.render("../views/pages/agen/lihatrumah",{pagetitle : pagetitle,error: error, name:name,session:req.session,rumah:rumah})
})

router.get("/akun", async (req,res)=>{
    let pagetitle = "akun";  
    let error = null
    let name = req.session.name
    res.render("../views/pages/agen/akun",{pagetitle : pagetitle,error: error, name:name,session:req.session})
})



module.exports = router;