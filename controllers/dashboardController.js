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
