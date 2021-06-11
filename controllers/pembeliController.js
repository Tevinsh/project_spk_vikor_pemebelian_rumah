"use strict";
const {Sequelize,QueryTypes,Op} = require('sequelize');
const app = require('../app');
const { models } = require("../components/database");


exports.updatePembeli = async function (req, res) {
    console.log(req.body,req.session.pembeli_id);
    await models.pelanggan.update(req.body, {
        where: {
            id_pelanggan: req.session.pembeli_id
        }
    }).then(() => {
        res.redirect('/pembeli/akun');
    }).catch(() => {
        req.session.error = "error pada saat melakukan update"
    })
}

exports.imgUpdate = async function (req, res) {
    await models.pelanggan.update({ imgPath: "/uploads/user_image/" + req.file.filename }, {
        where: {
            email: req.session.name
        }
    }).then(() => {
        req.session.error = 'sukses';
    }
    );
}

exports.getPembeli = async function (req, res) {
    return await models.pelanggan.findOne({
        where: {
            email: req.session.name
        }, raw: true
    })
}