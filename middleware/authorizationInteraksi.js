const { Interaksi } = require('../models');

const forPengguna = (req, res, next) => {
  if (req.user.peran !== 'pengguna') {
    return res.status(403).json({ message: 'Akses hanya untuk pengguna' });
  }
  next();
};

const forPemilikAtauPengelola = async (req, res, next) => {
  // Kamu bisa sesuaikan pengecekan ini jika interaksi punya id_pengguna
  // Contoh:
  const { id } = req.params;
  const interaksi = await Interaksi.findByPk(id);

  if (!interaksi) {
    return res.status(404).json({ message: 'Interaksi tidak ditemukan' });
  }

  if (interaksi.id_pengguna === req.user.id || req.user.peran === 'pengelola') {
    return next();
  }

  return res.status(403).json({ message: 'Akses ditolak' });
};

module.exports = { forPengguna, forPemilikAtauPengelola };
