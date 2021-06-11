const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('suka', {
    id_suka: {
      type: DataTypes.STRING(19),
      allowNull: false,
      primaryKey: true
    },
    id_agen: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'agen',
        key: 'id_agen'
      }
    },
    id_rumah: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'rumah',
        key: 'id_rumah'
      }
    },
    id_pelanggan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'pelanggan',
        key: 'id_pelanggan'
      }
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'suka',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_suka" },
        ]
      },
      {
        name: "suka_FK",
        using: "BTREE",
        fields: [
          { name: "id_pelanggan" },
        ]
      },
      {
        name: "suka_FK_1",
        using: "BTREE",
        fields: [
          { name: "id_rumah" },
        ]
      },
      {
        name: "suka_FK_2",
        using: "BTREE",
        fields: [
          { name: "id_agen" },
        ]
      },
    ]
  });
};
