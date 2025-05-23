const { Postingan } = require('../models');

const forPengguna = (req, res, next) => {
  if (req.user.peran !== 'pengguna') {
    return res.status(403).json({ message: 'Akses hanya untuk pengguna' });
  }
  next();
};

const forPemilikAtauPengelola = async (req, res, next) => {
  const { id } = req.params;
  const postingan = await Postingan.findByPk(id);
  if (!postingan) {
    return res.status(404).json({ message: 'Postingan tidak ditemukan' });
  }

  if (postingan.id_penulis === req.user.id || req.user.peran === 'pengelola') {
    return next();
  }

  return res.status(403).json({ message: 'Akses ditolak' });
};

module.exports = { forPengguna, forPemilikAtauPengelola};