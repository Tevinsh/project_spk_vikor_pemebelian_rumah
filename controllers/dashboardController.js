"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
//const { now } = require('sequelize/types/lib/utils');
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
        },raw : true
    })
    let agen = await models.agen.findOne({
        where : {
            id_agen : rumah.id_agen
        },raw : true
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

exports.sukai = async function (req,res){
    let input = {
        id_suka : 'YYY'+Date.now(),
        id_agen : req.query.agen,
        id_rumah : req.query.id_rumah,
        id_pelanggan : req.query.id_pelanggan,
        waktu : Date.now()
    }
    console.log(input);
    await models.suka.create(input).then(()=>{
        res.redirect('/dashboard/view'+req.query.id_rumah);
    }).catch(()=>{
        req.session.error = "ada masalah pada saat melakukan aksi"
    })
}

exports.cekSuka = async function(id_agen,id_rumah,id_pelanggan){
    console.log("test = "+id_agen+id_rumah+id_pelanggan);
    return await models.suka.findOne({
        where : {
        id_agen : id_agen,
        id_rumah : id_rumah,
        id_pelanggan : id_pelanggan
        }
    })
}
