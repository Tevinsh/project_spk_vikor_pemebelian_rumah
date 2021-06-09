const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const dashboard = require('../controllers/dashboardController');
const app = require('../app');
const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');

router.get("/", async (req,res)=>{
    let pagetitle = "Dashboard";
    req.session.error = null;
    result = await dashboard.getHome(req,res)
    res.render("../views/pages/dashboard",{name :req.session.name, error: req.session.error, result:result, pagetitle:pagetitle,session:req.session});
})

router.get("/view:id",async (req,res)=>{
    let error = req.session.error;
    let pagetitle = "rumah";
    req.session.error = null;
    let result = await dashboard.rumahView(req,res);
    await dashboard.countLihat(req,res);
    //res.json(result);
    res.render("../views/pages/propertiview",{name :req.session.name, error: error, pagetitle:pagetitle,result : result,session : req.session});
})

router.get("/search", async (req,res)=>{
    result = await dashboard.getHome(req,res);
    res.json(result.length);
})

router.get("/tentang", async (req,res)=>{
    res.render("../views/pages/tentang",{pagetitle : "tentang",name:req.session.name,session : req.session});
})

router.get("/panduan", async (req,res)=>{
    res.render("../views/pages/panduan",{pagetitle : "panduan",name:req.session.name,session : req.session});
})

module.exports = router;