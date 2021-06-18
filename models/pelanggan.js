const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pelanggan', {
    id_pelanggan: {
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
    imgPath: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    result: {
      type: DataTypes.JSON,
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    alamat: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    telepon: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pelanggan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pelanggan" },
        ]
      },
      {
        name: "pelanggan_FK",
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
