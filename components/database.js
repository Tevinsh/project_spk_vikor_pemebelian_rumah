const { Sequelize, DataTypes } = require('sequelize');
const initModels = require("../models/init-models");

const maindb = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    define: {
        freezeTableName: true, //disable pluarlize table name
        timestamps: false,
      },    
    dialect: 'mysql',
    logging: console.log,
    timezone: '+07:00'
});

//initialize sequelize auto
var models = initModels(maindb);
module.exports = models;
module.exports.models = models;
