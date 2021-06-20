const express = require('express');
const router = express.Router();
//const user = require('../controllers/userController');
//const dashboard = require('../controllers/dashboardController');
//const validator = require('../middlewares/validator');
//const { body, param, query, validationResult } = require("express-validator");
//const app = require('../app');
//const path = require('path')
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');





router.use('/dss', require('./dss'));
router.use('/profile',require('./profile'));
router.use('/user',require('./user'));
router.use('/dashboard',require('./dashboard'));
router.use('/agen',require('./agen'));
router.use('/admin',require('./admin'));
router.use('/pembeli',require('./pembeli'));


const index = function (req, res, next) {
  res.redirect('/dashboard');
} 


/*const vikor = require('../controllers/dssController')
router.get("/bodychecker" ,async (req,res)=>{
  req.session.name = 'test@test.com'
  let result = await vikor.getResult(req,res);
  res.json(result.result.alternatif);
})*/

const admin = require('../controllers/adminController')
router.post("/bodychecker1" ,async (req,res)=>{
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

const multer = require('multer');
const { cRumah } = require('../controllers/agenController');
router.post("/bodychecker3" ,async (req,res)=>{
  files.name = req.session.name;  
  uploadRumah(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        res.json(err);
      } else if (err) {
        res.json(err);
      }
      let filename = req.files.map((x)=>{return x.filename})
      console.log(filename);
      console.log(req.files);
      //await profile.imgUpdate(req,res);
      await cRumah(req,res,filename);
      res.redirect('/agen/rumah')
      //res.json(req.body);
      // Everything went fine.
    })
  //res.json(req.body);
})

router.get("/session" ,async (req,res)=>{
  res.json(req.session);
})

const dashboard = require('../controllers/dashboardController');
router.get("/view:id", async (req,res)=>{
  //UUagen@agen.com1623085629994
  res.json(await dashboard.countLihat(req,res));
  //res.json(await dashboard.rumahView(req,res))
})

router.post("/bodyparse", async (req,res)=>{
  res.json(req.body);
})





router.all('/', index);
router.all('*', index);

module.exports = router;