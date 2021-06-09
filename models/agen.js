const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agen', {
    id_agen: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'user',
        key: 'email'
      }
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imgPath: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telepon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'agen',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_agen" },
        ]
      },
      {
        name: "agen_FK",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
