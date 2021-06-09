"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");


exports.getKriteria = async function (req,res){
    return await models.kriteria.findAll()
}; 

exports.cRumah = async function (req,res,filename){
    let id = "UU"+req.session.name+Date.now();
    await models.rumah.create({
        id_rumah : id,
        luas_bangunan : req.body.luas_bangunan,
        luas_tanah : req.body.luas_tanah,
        kamar_tidur : req.body.kamar_tidur,
        kamar_mandi : req.body.kamar_mandi,
        lantai : req.body.lantai,
        fasilitas : req.body.fasilitas,
        jenis_sertifikasi : req.body.jenis_sertifikasi,
        alamat_lokasi : req.body.alamat_lokasi,
        judul_iklan : req.body.judul_iklan,
        deskripsi : req.body.deskripsi,
        harga : req.body.harga,
        id_agen : req.session.agen_id,
        imgPath : filename
    })
    await models.alternatif.create({
        id_alternatif : "QQ"+Date.now(),
        id_rumah : id,
        alternatif_value : req.body.value
    })
};

exports.getAgenRumah = async function (req,res){
    return await models.rumah.findAll({
        where : {
            id_agen : req.session.agen_id
        },raw : true
    })
};