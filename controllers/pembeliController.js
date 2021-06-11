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