const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true
    },
    password: {
      type: DataTypes.JSON,
      allowNull: true
    },
    user_type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    conf_email: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "false"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
