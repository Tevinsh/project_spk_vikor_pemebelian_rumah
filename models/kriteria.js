const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kriteria', {
    nama_kriteria: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    kuesioner: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    opsi: {
      type: DataTypes.JSON,
      allowNull: true
    },
    value: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'kriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "nama_kriteria" },
        ]
      },
    ]
  });
};
