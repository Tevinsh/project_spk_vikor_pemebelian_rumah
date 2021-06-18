"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const {encrypt,decrypt} = require("../middlewares/encryptor");

   
    
      exports.doLogin =  async function (req, res) {  
        let user = await models.user.findOne({where:  
              {email: req.body.email}
          ,raw:true
        })
        if(!user){
          req.session.error = "user atau password salah / tidak ditemukan"
          res.redirect("/dashboard");
        }else if(user){
          let hasil = bcrypt.compareSync(req.body.password, user.password);
          if (hasil == true){
            if(user.user_type == "agen"){
              req.session.error = "Logged in"
              let agen = await models.agen.findOne({
                where : {
                  email: req.body.email
                },
                raw : true
              })
              req.session.name = user.email;
              req.session.user_type = user.user_type;
              req.session.agen_id = agen.id_agen;
              res.redirect("/dashboard")
            }else if(user.user_type == "pembeli"){
              req.session.error = "Logged in"
              let pembeli = await models.pelanggan.findOne({
                where : {
                  email: req.body.email
                },
                raw : true
              })
              req.session.name = user.email;
              req.session.user_type = user.user_type;
              req.session.pembeli_id = pembeli.id_pelanggan;
              res.redirect("/dashboard")
            }
          }else{
            req.session.error = 'password salah'
            res.redirect('/dashboard');
          }
        }
        
        
        
        /*else if(user.user_type == "agen"){
          req.session.error = "agen true"
          let agen = await models.agen.findOne({
            where : {
              email: req.body.email
            },
            raw : true
          })
          req.session.name = user.email;
          req.session.user_type = user.user_type;
          req.session.agen_id = agen.id_agen;
          res.redirect("/dashview")
        }else if(user.user_type == "pembeli"){
          req.session.error = "pembeli true"
          let pembeli = await models.pelanggan.findOne({
            where : {
              email: req.body.email
            },
            raw : true
          })
          req.session.name = user.email;
          req.session.user_type = user.user_type;
          req.session.pembeli_id = pembeli.id_pelanggan;
          res.redirect("/dashview")
        } */
        
 /*       await models.user.findOne({where: {
          [Op.and]:[
              {email: req.body.email},
              {password: req.body.password}
          ]
          },raw:true
      }).then((result)=>{
        if (!result){
          req.session.error = "user atau password salah / tidak ditemukan"
          res.redirect("/dashview")
        }else{
          req.session.name=result.email;
          req.session.password=result.password;
          res.redirect("/dashview");
        }
      }) .catch((err)=>{
        res.json(err);
      }) 
*/
};

      exports.doSignup = async function (req, res) {  
        await models.user.create(
            {
                email : req.body.email,
                password: bcrypt.hashSync(req.body.password, salt),
                user_type: req.body.tipe,
            }
        )
          .catch((err)=>{
            req.session.error = err;
            console.log(err);
            res.redirect("/dashboard");
          }) 
          
          if(req.body.tipe == 'agen'){
            await models.agen.create(
              {
                  id_agen : 'AA'+ Date.now(),
                  email : req.body.email,
                  telepon: req.body.telepon
              }
          ).then((result)=>{
            req.session.error = "Sukses";
             res.redirect("/dashboard");      
           })
           .catch((err)=>{
            req.session.error = err;
            console.log(err);
             res.redirect("/dashboard");
           }) 
          }else if(req.body.tipe == 'pembeli'){
            await models.pelanggan.create(
              {
                  id_pelanggan : 'BB'+ Date.now(),
                  email : req.body.email,
                  telepon: req.body.telepon
              }
          ).then((result)=>{
              req.session.error = "Sukses";
             res.redirect("/dashboard");
           })
           .catch((err)=>{
            req.session.error = err;
            console.log(err);
             res.redirect("/dashboard");
           }) 
          }
      };
