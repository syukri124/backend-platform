const { Pengguna } = require('../models');

// GET pengguna by NIM
exports.getPenggunaByNim = async (req, res) => {
  try {
    const { nim } = req.params;
    const pengguna = await Pengguna.findOne({ where: { nim } });

    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna dengan NIM tersebut tidak ditemukan' });
    }

    res.json(pengguna);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna berdasarkan NIM', detail: error.message });
  }
};

// GET semua pengguna
exports.getAllPengguna = async (req, res) => {
  try {
    const pengguna = await Pengguna.findAll();
    res.json(pengguna); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna', detail: error.message });
  }
};

// GET pengguna by ID
exports.getPenggunaById = async (req, res) => {
  try {
    const pengguna = await Pengguna.findByPk(req.params.id);
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    res.json(pengguna); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data pengguna', detail: error.message });
  }
};

// POST pengguna baru
exports.createPengguna = async (req, res) => {
  try {
    const { nim, nama, email, kata_sandi, peran } = req.body;
    if (!nim || !nama || !email || !kata_sandi || !peran) {
      return res.status(400).json({ error: 'Semua field wajib diisi' });
    }

    const pengguna = await Pengguna.create({
      nim,
      nama,
      email,
      kata_sandi,
      peran
    });

    res.status(201).json(pengguna); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat pengguna', detail: error.message });
  }
};

// PUT update pengguna
exports.updatePengguna = async (req, res) => {
  try {
    const pengguna = await Pengguna.findByPk(req.params.id);
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    const { nim, nama, email, kata_sandi, peran } = req.body;

    pengguna.nim = nim || pengguna.nim;
    pengguna.nama = nama || pengguna.nama;
    pengguna.email = email || pengguna.email;
    pengguna.kata_sandi = kata_sandi || pengguna.kata_sandi;
    pengguna.peran = peran || pengguna.peran;

    await pengguna.save();

    res.json(pengguna); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui pengguna', detail: error.message });
  }
};

// DELETE pengguna
exports.deletePengguna = async (req, res) => {
  try {
    const pengguna = await Pengguna.findByPk(req.params.id);
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    await pengguna.destroy();
    res.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus pengguna', detail: error.message });
  }
};
