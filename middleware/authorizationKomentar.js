const { Komentar } = require('../models');

const forPengguna = (req, res, next) => {
  if (req.user.peran !== 'pengguna') {
    return res.status(403).json({ message: 'Akses hanya untuk pengguna' });
  }
  next();
};

const forPemilikAtauPengelola = async (req, res, next) => {
  const { id } = req.params;
  const komentar = await Komentar.findByPk(id);

  if (!komentar) {
    return res.status(404).json({ message: 'Komentar tidak ditemukan' });
  }

  // cek apakah user pemilik komentar atau pengelola
  if (komentar.id_penulis === req.user.id || req.user.peran === 'pengelola') {
    return next();
  }

  return res.status(403).json({ message: 'Akses ditolak' });
};

module.exports = { forPengguna, forPemilikAtauPengelola };
