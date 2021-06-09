var DataTypes = require("sequelize").DataTypes;
var _agen = require("./agen");
var _alternatif = require("./alternatif");
var _kriteria = require("./kriteria");
var _pelanggan = require("./pelanggan");
var _rumah = require("./rumah");
var _suka = require("./suka");
var _user = require("./user");

function initModels(sequelize) {
  var agen = _agen(sequelize, DataTypes);
  var alternatif = _alternatif(sequelize, DataTypes);
  var kriteria = _kriteria(sequelize, DataTypes);
  var pelanggan = _pelanggan(sequelize, DataTypes);
  var rumah = _rumah(sequelize, DataTypes);
  var suka = _suka(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  rumah.belongsTo(agen, { as: "id_agen_agen", foreignKey: "id_agen"});
  agen.hasMany(rumah, { as: "rumahs", foreignKey: "id_agen"});
  suka.belongsTo(agen, { as: "id_agen_agen", foreignKey: "id_agen"});
  agen.hasMany(suka, { as: "sukas", foreignKey: "id_agen"});
  suka.belongsTo(pelanggan, { as: "id_pelanggan_pelanggan", foreignKey: "id_pelanggan"});
  pelanggan.hasMany(suka, { as: "sukas", foreignKey: "id_pelanggan"});
  alternatif.belongsTo(rumah, { as: "id_rumah_rumah", foreignKey: "id_rumah"});
  rumah.hasMany(alternatif, { as: "alternatifs", foreignKey: "id_rumah"});
  suka.belongsTo(rumah, { as: "id_rumah_rumah", foreignKey: "id_rumah"});
  rumah.hasMany(suka, { as: "sukas", foreignKey: "id_rumah"});
  agen.belongsTo(user, { as: "email_user", foreignKey: "email"});
  user.hasMany(agen, { as: "agens", foreignKey: "email"});
  pelanggan.belongsTo(user, { as: "email_user", foreignKey: "email"});
  user.hasMany(pelanggan, { as: "pelanggans", foreignKey: "email"});

  return {
    agen,
    alternatif,
    kriteria,
    pelanggan,
    rumah,
    suka,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
