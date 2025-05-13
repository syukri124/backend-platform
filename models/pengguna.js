const { Sequelize, DataTypes } = require('sequelize');
const { toWIB } = require('../utils/waktu');

module.exports = (sequelize) => {
  const Pengguna = sequelize.define('pengguna', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nim: {
      type: DataTypes.STRING(12),
      unique: true,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    kata_sandi: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    peran: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['pengelola', 'pengguna']],
      },
    },
    dibuat_pada: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    get() {
        // Menambahkan konversi waktu WIB pada saat pengambilan data
        const value = this.getDataValue('dibuat_pada');
        return toWIB(value);  // Menggunakan fungsi toWIB untuk konversi ke WIB
      }
    },
  }, {
    tableName: 'pengguna',
    timestamps: false,
  });

  Pengguna.associate = (models) => {
    Pengguna.hasMany(models.Postingan, {
      foreignKey: 'id_penulis',
      as: 'postingan',
    });
    Pengguna.hasMany(models.Komentar, {
      foreignKey: 'id_penulis',
      as: 'komentar',
    });
    Pengguna.hasMany(models.Interaksi, {
      foreignKey: 'id_pengguna',
      as: 'interaksi',
    });
  };

  return Pengguna;
};
