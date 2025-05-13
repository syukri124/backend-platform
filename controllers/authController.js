// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Pengguna = require('../models/pengguna');

exports.register = async (req, res) => {
  try {
    const { nim, nama, email, kata_sandi, peran } = req.body;
    const existing = await Pengguna.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email sudah digunakan' });

    const hashed = await bcrypt.hash(kata_sandi, 10);
    const pengguna = await Pengguna.create({ nim, nama, email, kata_sandi: hashed, peran });

    res.status(201).json({ message: 'Registrasi berhasil', pengguna: { id: pengguna.id, email: pengguna.email } });
  } catch (err) {
    res.status(500).json({ message: 'Gagal registrasi', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, kata_sandi } = req.body;
    const pengguna = await Pengguna.findOne({ where: { email } });
    if (!pengguna) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    const cocok = await bcrypt.compare(kata_sandi, pengguna.kata_sandi);
    if (!cocok) return res.status(401).json({ message: 'Kata sandi salah' });

    const token = jwt.sign({ id: pengguna.id, peran: pengguna.peran }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login gagal', error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const pengguna = await Pengguna.findByPk(req.user.id, { attributes: { exclude: ['kata_sandi'] } });
    res.json(pengguna);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil profil', error: err.message });
  }
};
