const { Postingan, Kategori, Pengguna } = require('../models');

// CREATE Postingan
exports.createPostingan = async (req, res) => {
    try {
        const { id_penulis, id_kategori, judul, konten, anonim, status } = req.body;
        const postingan = await Postingan.create({ id_penulis, id_kategori, judul, konten, anonim, status });

        res.status(201).json(postingan); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal membuat postingan', error });
    }
};

// GET All Postingan
exports.getAllPostingan = async (req, res) => {
    try {
        const postingan = await Postingan.findAll({
            include: [
                { model: Kategori, as: 'kategori' },
                { model: Pengguna, as: 'penulis' }
            ]
        });

        res.status(200).json(postingan); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mendapatkan postingan', error });
    }
};

// GET Postingan by ID
exports.getPostinganById = async (req, res) => {
    try {
        const postingan = await Postingan.findOne({
            where: { id: req.params.id },
            include: [
                { model: Kategori, as: 'kategori' },
                { model: Pengguna, as: 'penulis' }
            ]
        });

        if (!postingan) return res.status(404).json({ message: 'Postingan tidak ditemukan' });

        res.status(200).json(postingan); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mendapatkan postingan', error });
    }
};

// UPDATE Postingan
exports.updatePostingan = async (req, res) => {
    try {
        const { judul, konten, anonim, status } = req.body;
        const [jumlahUpdate, postingan] = await Postingan.update(
            { judul, konten, anonim, status },
            {
                where: { id: req.params.id },
                returning: true
            }
        );

        if (jumlahUpdate === 0) return res.status(404).json({ message: 'Postingan tidak ditemukan' });

        res.status(200).json(postingan[0]); // Tidak perlu melakukan konversi waktu karena sudah disesuaikan di model
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui postingan', error });
    }
};

// DELETE Postingan
exports.deletePostingan = async (req, res) => {
    try {
        const postingan = await Postingan.destroy({
            where: { id: req.params.id }
        });

        if (!postingan) return res.status(404).json({ message: 'Postingan tidak ditemukan' });

        res.status(200).json({ message: 'Postingan berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus postingan', error });
    }
};
