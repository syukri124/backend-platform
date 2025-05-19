const { Interaksi, Komentar, Postingan, Pengguna } = require('../models');

// GET semua interaksi
exports.getAllInteraksi = async (req, res) => {
  try {
    const interaksi = await Interaksi.findAll({
      include: [
        { model: Komentar, as: 'komentar' },
        { model: Postingan, as: 'postingan' },
        { model: Pengguna, as: 'pengguna' }
      ]
    });
    res.json(interaksi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data interaksi', detail: error.message });
  }
};

// GET interaksi berdasarkan ID
exports.getInteraksiById = async (req, res) => {
  try {
    const interaksi = await Interaksi.findByPk(req.params.id, {
      include: [
        { model: Komentar, as: 'komentar' },
        { model: Postingan, as: 'postingan' },
        { model: Pengguna, as: 'pengguna' }
      ]
    });
    if (!interaksi) {
      return res.status(404).json({ error: 'Interaksi tidak ditemukan' });
    }
    res.json(interaksi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil interaksi', detail: error.message });
  }
};

// POST membuat interaksi baru
exports.createInteraksi = async (req, res) => {
  try {
    const { id_pengguna, id_komentar, id_postingan, tipe } = req.body;

    if (!id_pengguna || !tipe || (!id_komentar && !id_postingan)) {
      return res.status(400).json({ error: 'id_pengguna, tipe, dan salah satu dari id_komentar atau id_postingan wajib diisi' });
    }

    const interaksi = await Interaksi.create({
      id_pengguna,
      id_komentar,
      id_postingan,
      tipe,
    });
    res.status(201).json(interaksi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat interaksi', detail: error.message });
  }
};

// PUT memperbarui interaksi
exports.updateInteraksi = async (req, res) => {
  try {
    const interaksi = await Interaksi.findByPk(req.params.id);
    if (!interaksi) {
      return res.status(404).json({ error: 'Interaksi tidak ditemukan' });
    }

    const { id_pengguna, id_komentar, id_postingan, tipe } = req.body;

    await interaksi.update({
      id_pengguna: id_pengguna ?? interaksi.id_pengguna,
      id_komentar: id_komentar ?? interaksi.id_komentar,
      id_postingan: id_postingan ?? interaksi.id_postingan,
      tipe: tipe ?? interaksi.tipe,
    });

    res.json(interaksi);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui interaksi', detail: error.message });
  }
};

// DELETE interaksi
exports.deleteInteraksi = async (req, res) => {
  try {
    const interaksi = await Interaksi.findByPk(req.params.id);
    if (!interaksi) {
      return res.status(404).json({ error: 'Interaksi tidak ditemukan' });
    }

    await interaksi.destroy();
    res.json({ message: 'Interaksi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus interaksi', detail: error.message });
  }
};
