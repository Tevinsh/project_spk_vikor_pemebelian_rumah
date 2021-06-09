const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pembeli', {
    id_pembeli: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    telepon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    tanggal_lahir: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pembeli',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_pembeli" },
        ]
      },
    ]
  });
};
