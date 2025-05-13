const jwt = require('jsonwebtoken');

// Middleware verifikasi token
const verifikasiToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user;
    next();
  });
};

// Middleware otorisasi berdasarkan peran
const otorisasiPeran = (...peranDiizinkan) => {
  return (req, res, next) => {
    if (!peranDiizinkan.includes(req.user.peran)) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  };
};

module.exports = { verifikasiToken, otorisasiPeran };