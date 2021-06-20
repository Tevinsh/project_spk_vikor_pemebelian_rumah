const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const pembeli = require('../controllers/pembeliController')
const app = require('../app');
const path = require('path');
const vikor =require('../controllers/dssController');
const multer = require('multer');
const { uploadAvatar, uploadRumah, files } = require('../controllers/fileUploadController');

router.get("/hasil", async (req, res) => {
    if (req.session.user_type == 'pembeli'){
    let pagetitle = "lihat hasil"
    let error = req.session.error
    req.session.error = null
    let session = req.session
    let result = await vikor.getResult(req,res);
    //res.json(result.result.kriteria.length);
    //console.log(JSON.stringify(result.kriteria));
    res.render("../views/pages/pembeli/lihathasil",{pagetitle : pagetitle,error : error,name:session.name,session : session,result:result});
    }else{
        req.session.error='anda belum login';
        res.redirect('/dashboard');
    }
})

router.get("/akun", async (req, res) => {
    if (req.session.user_type == 'pembeli'){
    let pagetitle = "akun"
    let error = req.session.error
    req.session.error = null
    let session = req.session
    let result = await pembeli.getPembeli(req,res);
    res.render("../views/pages/pembeli/akun",{pagetitle : pagetitle,error : error,name:session.name,session : session,result : result});
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.post('/upload', function (req, res) {
    if (req.session.user_type == 'pembeli'){
    files.name = req.session.name;
    uploadAvatar(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.json(err);
        } else if (err) {
            res.json(err);
        }
        console.log(req.file);
        await pembeli.imgUpdate(req, res);
        res.redirect('/pembeli/akun');
        // Everything went fine.
    })
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.post("/update",validator.postUpdateProfile(), async (req, res) => {
    if (req.session.user_type == 'pembeli'){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let extractedErrors = [];
            errors.array().map(err => extractedErrors.push(err.msg));
          req.session.error = extractedErrors;
          console.log("error = "+extractedErrors);
          res.redirect("/pembeli/akun");
        } else {
            await pembeli.updatePembeli(req, res);
        }
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})





module.exports = router;