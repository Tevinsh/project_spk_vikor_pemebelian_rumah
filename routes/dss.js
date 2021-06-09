const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validator');
const { body, param, query, validationResult } = require("express-validator");
const app = require('../app');
const path = require('path')
const vikor = require('../controllers/dssController');
const {uploadAvatar, uploadRumah,files} = require('../controllers/fileUploadController');
const { nextTick } = require('process');


router.get("/", async (req,res,next)=>{
    let error = req.session.error;
    let pagetitle = "DSS";
    
    if(req.session.name){
      let hasil = await vikor.makepairwise();
      let result = await vikor.getResult(req,res);
      req.session.error = null;
      res.render("../views/pages/DSS",{name :req.session.name, error: error,pagetitle:pagetitle, result : hasil, result2 : result,session:req.session});
    }else{
      req.session.error = null;
      res.render("../views/pages/DSS",{name :req.session.name, error: error,pagetitle:pagetitle,session:req.session});
    }
    req.session.error = null;
    //console.log(await result.alternatif);
    res.render("../views/pages/DSS",{name :req.session.name, error: error,pagetitle:pagetitle, result : hasil, result2 : result,session:req.session});
})


router.post("/dsspost" ,async (req,res)=>{

    // for DSS view
    let test = req.body.value 
    let pairwise = await vikor.pairwisefill(test);
    console.log(pairwise);
    let weight = await vikor.calculateWeight(pairwise);
    //console.log(pairwise);
    console.log("weight = " + weight);
    let result = await vikor.vikor(weight);
    console.log("pairwise = "+JSON.stringify(pairwise));
    await vikor.resultPost(req,res,result);
    res.redirect('/dss'); 
    //res.json(await vikor.getAlternatif());
  
  
  })


module.exports = router;