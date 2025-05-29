const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Pengguna = require('./pengguna')(sequelize);
const Kategori = require('./kategori')(sequelize);
const Postingan = require('./postingan')(sequelize);
const Komentar = require('./komentar')(sequelize);
const Interaksi = require('./interaksi')(sequelize);
const Notifikasi = require('./notifikasi')(sequelize);

Pengguna.hasMany(Postingan, { foreignKey: 'id_penulis', as: 'postingan' });
Postingan.belongsTo(Pengguna, { foreignKey: 'id_penulis', as: 'penulis' });

Kategori.hasMany(Postingan, { foreignKey: 'id_kategori', as: 'postingan' });
Postingan.belongsTo(Kategori, { foreignKey: 'id_kategori', as: 'kategori' });

Postingan.hasMany(Komentar, { foreignKey: 'id_postingan', as: 'komentar' });
Komentar.belongsTo(Postingan, { foreignKey: 'id_postingan', as: 'postingan' });

Pengguna.hasMany(Komentar, { foreignKey: 'id_penulis', as: 'komentar' });
Komentar.belongsTo(Pengguna, { foreignKey: 'id_penulis', as: 'penulis' });

Pengguna.hasMany(Interaksi, { foreignKey: 'id_pengguna', as: 'interaksi' });
Interaksi.belongsTo(Pengguna, { foreignKey: 'id_pengguna', as: 'pengguna' });

Postingan.hasMany(Interaksi, { foreignKey: 'id_postingan', as: 'interaksiPost' });
Interaksi.belongsTo(Postingan, { foreignKey: 'id_postingan', as: 'postingan' });

Komentar.hasMany(Interaksi, { foreignKey: 'id_komentar', as: 'interaksi' });
Interaksi.belongsTo(Komentar, { foreignKey: 'id_komentar', as: 'komentar' });

// Notifikasi associations
Notifikasi.belongsTo(Pengguna, { foreignKey: 'id_penerima', as: 'penerima' });
Notifikasi.belongsTo(Pengguna, { foreignKey: 'id_pengirim', as: 'pengirim' });
Notifikasi.belongsTo(Postingan, { foreignKey: 'id_postingan', as: 'postingan' });
Notifikasi.belongsTo(Komentar, { foreignKey: 'id_komentar', as: 'komentar' });

Pengguna.hasMany(Notifikasi, { foreignKey: 'id_penerima', as: 'notifikasiDiterima' });
Pengguna.hasMany(Notifikasi, { foreignKey: 'id_pengirim', as: 'notifikasiDikirim' });
Postingan.hasMany(Notifikasi, { foreignKey: 'id_postingan', as: 'notifikasi' });
Komentar.hasMany(Notifikasi, { foreignKey: 'id_komentar', as: 'notifikasi' });

module.exports = {
  sequelize,
  Sequelize,
  Pengguna,
  Kategori,
  Postingan,
  Komentar,
  Interaksi,
  Notifikasi,
};
