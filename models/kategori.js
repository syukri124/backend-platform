const { Sequelize, DataTypes } = require('sequelize');

// Mendefinisikan model Kategori
module.exports = (sequelize) => {
  const Kategori = sequelize.define('Kategori', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: {
      type: DataTypes.STRING(50),  // Sesuaikan dengan VARCHAR(50)
      allowNull: false,
    },
  }, {
    tableName: 'kategori',
    timestamps: false,
  });

  Kategori.associate = (models) => {
    Kategori.hasMany(models.Postingan, {
      foreignKey: 'id_kategori',
      as: 'postingan',
    });
  };

  return Kategori;
};
