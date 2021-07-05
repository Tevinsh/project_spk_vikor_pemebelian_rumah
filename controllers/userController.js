"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
const {encrypt,decrypt} = require("../middlewares/encryptor");
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');

function generateOTP() {
          
  // Declare a digits variable 
  // which stores all digits
  var digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++ ) {
      OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
async function sendOTP(otp,req,res) {
  let transporter = nodemailer.createTransport(smtpTransport({    
    service: 'gmail',
    host: 'smtp.gmail.com', 
    auth: {        
         user: 'spkvikora@gmail.com',        
         pass: 'Superman@123'    
    }
  }));
  const mailOptions = {
    from: 'spkvikora@gmail.com',
    to: req.body.email,                   // from req.body.to
    subject: 'konfirmasi OTP',         //from req.body.subject
    text: `kode otp anda adalah ${otp}`             //from req.body.message
};
//delivery
transporter.sendMail(mailOptions);
}
    
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
          if (hasil == true && user.conf_email == 'true'){
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
            }else if(user.user_type == "admin"){
              req.session.error = "Logged in"
              req.session.name = user.email;
              req.session.user_type = user.user_type;
              res.redirect("/admin/dashboard")
            }
          }else if(hasil == true && user.conf_email == 'false'){
            req.session.error = "anda belum konfirmasi email, Silahkan cek email yang telah anda daftarkan";
            res.redirect(`/user/otp?e=${req.body.email}`);
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
            let otp = generateOTP();
            await models.otp.create({id : 'jjs'+Date.now(),email : req.body.email,otp: otp});
            sendOTP(otp,req,res);
            await models.agen.create(
              {
                  id_agen : 'AA'+ Date.now(),
                  email : req.body.email,
                  telepon: req.body.telepon
              }
          ).then(()=>{
           
            res.redirect(`/user/otp?e=${req.body.email}`);
           })
           .catch((err)=>{
            req.session.error = err;
            console.log(err);
             res.redirect("/dashboard");
           }) 
          }else if(req.body.tipe == 'pembeli'){
            let otp = generateOTP();
            await models.otp.create({id : 'jjs'+Date.now(),email : req.body.email,otp: otp});
            sendOTP(otp,req,res);
            await models.pelanggan.create(
              {
                  id_pelanggan : 'BB'+ Date.now(),
                  email : req.body.email,
                  telepon: req.body.telepon
              }
          ).then((result)=>{
            res.redirect(`/user/otp?e=${req.body.email}`);
           })
           .catch((err)=>{
            req.session.error = err;
            console.log(err);
             res.redirect("/dashboard");
           }) 
          }
      };

      exports.verifyOtp = async function (req,res){
        let result = await models.otp.findOne({where : {
          email : req.body.e,
          otp : req.body.otp
        }});
        if (result){
          await models.user.update({conf_email : 'true'},{where : {email : req.body.e}})
          await models.otp.destroy({
            where : {
              email : req.body.e,
              otp : req.body.otp
            }
          }).then(()=>{
            req.session.error = "sukses";
            res.redirect('/dashboard');
          })
        }else{
          req.session.error = "otp salah";
          res.redirect(`/user/otp?e=${req.body.e}`);
        }
      }

      exports.resetPass = async function (req,res){
        let otp = generateOTP();
        await models.otp.create({id : 'jjs'+Date.now(),email : req.body.email,otp: otp});
        sendOTP(otp,req,res)
        req.session.error = "OTP berhasil dikirim"
        res.redirect(`/user/reset/${req.body.email}`);
      }

      exports.passUpdateNew = async function (req,res){
        await models.user.update({password: bcrypt.hashSync(req.body.password, salt)},{where : {email: req.body.email}})
        .then(()=>{
          req.session.error = "Sukses mengubah Password"
        })
        .catch(()=>{
          req.session.error = "Gagal Merubah Password"
        });
      }

      exports.passUpdate = async function (req,res){
        await models.user.update({password: bcrypt.hashSync(req.body.passbaru, salt)},{where : {email: req.session.name}})
        .then(()=>{
          req.session.error = "Sukses mengubah Password"
        })
        .catch(()=>{
          req.session.error = "Gagal Merubah Password"
        });
      }