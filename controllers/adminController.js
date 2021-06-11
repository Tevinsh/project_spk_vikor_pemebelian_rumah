"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");


exports.cKriteria = async function (req,res){
    models.kriteria.create(req.body).then(()=>req.session.error = "sukses");
}

exports.rKriteria = async function (req,res){
    return await models.kriteria.findAll();
}

exports.dasbor = async function (req,res){
    let propertiCount = await models.rumah.count();
    let userCount = await models.user.count();
    let pembeliCount = await models.pelanggan.count();
    let agenCount = await models.agen.count();
    return {
        propertiCount : propertiCount,
        userCount : userCount,
        pembeliCount : pembeliCount,
        agenCount : agenCount
    }
}

exports.delete = async function (req,res){
    return await models.kriteria.destroy({
        where : {
            nama_kriteria : req.params.id
        }
    }).then(()=>{
        res.redirect('/admin/kriteria');
    });
}