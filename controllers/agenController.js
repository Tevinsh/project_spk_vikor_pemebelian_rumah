"use strict";
const { Sequelize, QueryTypes, Op } = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");
const agen = require('../models/agen');
const rumah = require('../models/rumah');


exports.getKriteria = async function (req, res) {
    return await models.kriteria.findAll()
};

exports.cRumah = async function (req, res, filename) {
    let id = "UU" + req.session.name + Date.now();
    await models.rumah.create({
        id_rumah: id,
        luas_bangunan: req.body.luas_bangunan,
        luas_tanah: req.body.luas_tanah,
        kamar_tidur: req.body.kamar_tidur,
        kamar_mandi: req.body.kamar_mandi,
        wilayah : req.body.wilayah,
        lantai: req.body.lantai,
        fasilitas: req.body.fasilitas,
        jenis_sertifikasi: req.body.jenis_sertifikasi,
        alamat_lokasi: req.body.alamat_lokasi,
        judul_iklan: req.body.judul_iklan,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga,
        id_agen: req.session.agen_id,
        imgPath: filename
    })
    await models.alternatif.create({
        id_alternatif: "QQ" + Date.now(),
        id_rumah: id,
        alternatif_value: req.body.value
    })
};

exports.getAgenRumah = async function (req, res) {
    return await models.rumah.findAll({
        where: {
            id_agen: req.session.agen_id
        }, raw: true
    })
};

exports.getAgen = async function (req, res) {
    return await models.agen.findOne({
        where: {
            email: req.session.name
        }, raw: true
    })
}

exports.updateAgen = async function (req, res) {
    await models.agen.update(req.body, {
        where: {
            id_agen: req.session.agen_id
        }
    }).then(() => {
        res.redirect('/agen/akun');
    }).catch(() => {
        req.session.error = "error pada saat melakukan update"
    })
}

exports.imgUpdate = async function (req, res) {
    await models.agen.update({ imgPath: "/uploads/user_image/" + req.file.filename }, {
        where: {
            email: req.session.name
        }
    }).then(() => {
        req.session.error = 'sukses';
    }
    );
}

exports.dashboard = async function (req, res) {
    let propertiCount = await models.rumah.count({
        where: {
            id_agen: req.session.agen_id
        }
    });
    let disukai = await models.suka.count({
        where: {
            id_agen: req.session.agen_id
        }
    });
    let dilihat = await models.rumah.findAll({
        where: {
            id_agen: req.session.agen_id
        },
        attributes: [[Sequelize.fn('sum', Sequelize.col('dilihat')), 'dilihat']],
        raw: true,
    })
    let init = await models.suka.findAll({
        where: {
            id_agen: req.session.agen_id
        },
        attributes: ['id_rumah'],
        //raw : true,
        include: [{
            model: models.pelanggan,
            as: 'id_pelanggan_pelanggan',
            attributes: ['nama', 'alamat', 'telepon']
        },
        {
            model: models.rumah,
            as: 'id_rumah_rumah',
            attributes: ['judul_iklan']
        }]
    })
    let dataDisukai = await init.map((x) => {
        return {
            id_rumah: x.id_rumah,
            judul_iklan: x.id_rumah_rumah.judul_iklan,
            nama_pelanggan: x.id_pelanggan_pelanggan.nama,
            alamat_pelanggan: x.id_pelanggan_pelanggan.alamat,
            telepon_pelanggan: x.id_pelanggan_pelanggan.telepon
        }
    })
    return {
        propertiCount: propertiCount,
        disukai: disukai,
        dilihat: dilihat[0].dilihat,
        dataDisukai: dataDisukai
    }

}

exports.updateRumah = async function(req,res){

}

exports.delRumah = async function(req,res){
    await models.rumah.destroy({
        where: {
            id_rumah : req.params.id
        }
    }).then(()=>{
        res.redirect('/agen/lihat')
    })
}

