const { Pengguna } = require('../models');

const forPengelola = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

    const pengguna = await Pengguna.findByPk(req.user.id);
    if (!pengguna || pengguna.peran !== 'pengelola') {
      return res.status(403).json({ message: 'Akses hanya untuk pengelola' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

module.exports = {forPengelola};
