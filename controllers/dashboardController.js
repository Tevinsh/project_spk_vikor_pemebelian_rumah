"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");


exports.getHome = async function (req,res){
    console.log(await models.rumah.findAll({raw:true}));
    if (req.query.search === undefined || req.query.search == null || req.query.search == ""){
        return await models.rumah.findAll({raw:true});
    }else{
        return await models.rumah.findAll({
            where:{
                judul_iklan : {
                    [Op.like]: `%`+req.query.search+`%`
                }
            },
            raw:true
        })
    }
    
}

exports.rumahView = async function (req,res){
    let rumah = await models.rumah.findOne({
        where : {
            id_rumah : req.params.id
        }
    })
    let agen = await models.agen.findOne({
        where : {
            id_agen : rumah.id_agen
        }
    })
    let result = {
        agen,
        rumah
    };
    return result;
}

exports.countLihat = async function (req,res){
    if(req.session.name && req.session.user_type == "pembeli"){
        let init = await models.rumah.findOne({
            where : {
                id_rumah : req.params.id
            },
            attributes :['dilihat'],
            raw : true
        })
        let dilihat = init.dilihat
        console.log(dilihat);
        if (dilihat == null|| dilihat == undefined){
            dilihat = 1;
        }else{
            dilihat ++
        }
        await models.rumah.update({
            dilihat : dilihat
        },{
            where: {
                id_rumah : req.params.id
            }
        }
        )
        return dilihat;
    }
}

exports.resetdss = async function (req,res){
    await models.pelanggan.update({
        result : null
    },{
        where : {
            email : req.session.name
        }
    })
}
