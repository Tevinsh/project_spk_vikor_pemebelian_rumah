const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('alternatif', {
    id_alternatif: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    id_rumah: {
      type: DataTypes.STRING(100),
      allowNull: false,
      references: {
        model: 'rumah',
        key: 'id_rumah'
      }
    },
    alternatif_value: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'alternatif',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_alternatif" },
        ]
      },
      {
        name: "alternatif_FK",
        using: "BTREE",
        fields: [
          { name: "id_rumah" },
        ]
      },
    ]
  });
};
