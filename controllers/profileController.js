"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");

exports.profile = async function (req,res){
    let result =  await models.user.findOne({
        where:{
            email:req.session.name
        },
        raw: true,
        attributes: ['user_type']
    }).catch((err)=>{
        return err;
    })
    console.log(result);
        if(result.user_type == 'pembeli'){
            return await models.pelanggan.findOne({
                where:{
                    email:req.session.name
                },
                raw:true
            })
        }else if(result.user_type == 'agen'){
            return await models.agen.findOne({
                where:{
                    email:req.session.name
                },
                raw:true
            })
        }else{
            return "error"
        };
 }
 
 exports.profileUpdate = async function (req,res){
     await models.pelanggan.update(req.body, {
         where: {
           email : req.session.name
         }
       }).then(()=>{
           req.session.error = "Sukses";
           res.redirect("/profile");
       }).catch((err)=>{
           req.session.error = "Gagal, internal system error";
       })
 }

 
 exports.imgUpdate = async function (req,res){
     await models.pelanggan.update({ imgPath: "/uploads/user_image/"+req.file.filename }, {
         where: {
           email: req.session.name
         }
       }).then(()=>{
         req.session.error = 'sukses';
       }
       );
 }