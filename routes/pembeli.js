const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const agen = require('../controllers/agenController')
const app = require('../app');
const path = require('path');
const vikor =require('../controllers/dssController');
const multer = require('multer');
const { uploadAvatar, uploadRumah, files } = require('../controllers/fileUploadController');

router.get("/hasil", async (req, res) => {
    req.session.name = 'test@test.com'
    let pagetitle = "lihat hasil"
    let error = null
    let session = req.session
    let result = await vikor.getResult(req,res);
    //res.json(result.result.kriteria.length);
    //console.log(JSON.stringify(result.kriteria));
    res.render("../views/pages/pembeli/lihathasil",{pagetitle : pagetitle,error : session.error,name:session.name,session : session,result:result});
})

router.get("/akun", async (req, res) => {
    let pagetitle = "akun"
    let error = null
    let session = req.session
    res.render("../views/pages/pembeli/akun",{pagetitle : pagetitle,error : session.error,name:session.name,session : session});
})





module.exports = router;