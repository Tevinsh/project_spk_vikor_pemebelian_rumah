const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rumah', {
    id_rumah: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    nama_rumah: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    luas_bangunan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    harga: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    luas_tanah: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kamar_tidur: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    kamar_mandi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    lantai: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fasilitas: {
      type: DataTypes.JSON,
      allowNull: true
    },
    jenis_sertifikasi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alamat_lokasi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    judul_iklan: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    deskripsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    wilayah: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_agen: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'agen',
        key: 'id_agen'
      }
    },
    imgPath: {
      type: DataTypes.JSON,
      allowNull: true
    },
    dilihat: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rumah',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_rumah" },
        ]
      },
      {
        name: "rumah_FK",
        using: "BTREE",
        fields: [
          { name: "id_agen" },
        ]
      },
    ]
  });
};
