const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const agen = require('../controllers/agenController')
const app = require('../app');
const path = require('path')
const multer = require('multer');
const { uploadAvatar, uploadRumah, files } = require('../controllers/fileUploadController');

router.get("/dashboard", async (req, res) => {
    if (req.session.user_type == 'agen'){
    let pagetitle = "agen";
    let error = req.session.error
    req.session.error = null
    let name = req.session.name
    let result = await agen.dashboard(req, res);
    res.render("../views/pages/agen/dasbor", { pagetitle: pagetitle, error: error, name: name, session: req.session, result: result })
    }else{
        req.session.error='anda belum login';
        res.redirect('/dashboard');
    }
})

router.get("/rumah", async (req, res) => {
    if (req.session.user_type == 'agen'){
    let pagetitle = "rumah";
    let error = req.session.error
    req.session.error = null
    let name = req.session.name
    let kriteria = await agen.getKriteria();
    res.render("../views/pages/agen/manajemenrumah", { pagetitle: pagetitle, error: error, name: name, kriteria: kriteria, session: req.session })
    }else{
        req.session.error='anda belum login';
        res.redirect('/dashboard');
    }
})

router.get("/lihat", async (req, res) => {
    if (req.session.user_type == 'agen'){
    let pagetitle = "lihat";
    let error = req.session.error
    req.session.error = null
    let name = req.session.name
    let rumah = await agen.getAgenRumah(req, res);
    console.log(rumah.imgPath);
    res.render("../views/pages/agen/lihatrumah", { pagetitle: pagetitle, error: error, name: name, session: req.session, rumah: rumah })
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/akun", async (req, res) => {
    if (req.session.user_type == 'agen'){
    let pagetitle = "akun";
    let error = req.session.error
    req.session.error = null
    let name = req.session.name
    let result = await agen.getAgen(req, res);
    console.log(result);
    res.render("../views/pages/agen/akun", { pagetitle: pagetitle, error: error, name: name, session: req.session, result: result })
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.post("/update", validator.postUpdateProfile(), async (req, res) => {
    if (req.session.user_type == 'agen'){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let extractedErrors = [];
        errors.array().map(err => extractedErrors.push(err.msg));
      req.session.error = extractedErrors;
      console.log("error = "+extractedErrors);
      res.redirect("/agen/akun");
    } else {
        await agen.updateAgen(req, res);
    }
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.post('/upload', function (req, res) {
    if (req.session.user_type == 'agen'){
    files.name = req.session.name;
    uploadAvatar(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.json(err);
        } else if (err) {
            res.json(err);
        }
        console.log(req.file);
        await agen.imgUpdate(req, res);
        res.redirect('/agen/akun');
        // Everything went fine.
    })
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})

router.get("/delete:id", async (req, res) => {
    if (req.session.user_type == 'agen'){
    await agen.delRumah(req, res);
}else{
    req.session.error='anda belum login';
    res.redirect('/dashboard');
}
})


module.exports = router;