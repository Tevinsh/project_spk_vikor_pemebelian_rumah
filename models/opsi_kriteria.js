const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('opsi_kriteria', {
    id_kriteria: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opsi: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    id_opsi: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'opsi_kriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_opsi" },
        ]
      },
    ]
  });
};
