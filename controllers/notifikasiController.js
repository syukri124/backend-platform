const { Notifikasi, Pengguna, Postingan, Komentar } = require('../models');

// GET semua notifikasi untuk user yang sedang login
const getAllNotifikasi = async (req, res) => {
  try {
    const id_penerima = req.user.id;

    // Cleanup orphaned notifications first
    await cleanupOrphanedNotifications();

    const notifikasi = await Notifikasi.findAll({
      where: { id_penerima },
      order: [['dibuat_pada', 'DESC']],
      include: [
        {
          model: Pengguna,
          as: 'pengirim',
          attributes: ['id', 'nama', 'email']
        },
        {
          model: Postingan,
          as: 'postingan',
          attributes: ['id', 'judul'],
          required: false // LEFT JOIN to include notifications even if post is deleted
        },
        {
          model: Komentar,
          as: 'komentar',
          attributes: ['id', 'konten'],
          required: false // LEFT JOIN to include notifications even if comment is deleted
        }
      ]
    });

    // Filter out notifications for deleted posts/comments
    const validNotifikasi = notifikasi.filter(notif => {
      // Keep system notifications and notifications where referenced content still exists
      if (notif.tipe === 'system') return true;
      if (notif.id_postingan && !notif.postingan) return false;
      if (notif.id_komentar && !notif.komentar) return false;
      return true;
    });

    res.json(validNotifikasi);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      message: 'Gagal mengambil notifikasi',
      error: error.message
    });
  }
};

// Helper function to cleanup orphaned notifications
const cleanupOrphanedNotifications = async () => {
  try {
    // Delete notifications for non-existent posts
    await Notifikasi.destroy({
      where: {
        id_postingan: {
          [require('sequelize').Op.not]: null
        }
      },
      include: [{
        model: Postingan,
        as: 'postingan',
        where: null,
        required: false
      }]
    });

    // Delete notifications for non-existent comments
    await Notifikasi.destroy({
      where: {
        id_komentar: {
          [require('sequelize').Op.not]: null
        }
      },
      include: [{
        model: Komentar,
        as: 'komentar',
        where: null,
        required: false
      }]
    });
  } catch (error) {
    console.error('Error cleaning up orphaned notifications:', error);
  }
};

// POST membuat notifikasi baru
const createNotifikasi = async (req, res) => {
  try {
    const { id_penerima, id_pengirim, id_postingan, id_komentar, tipe, judul, pesan } = req.body;

    // Validasi input
    if (!id_penerima || !tipe || !judul || !pesan) {
      return res.status(400).json({
        message: 'ID penerima, tipe, judul, dan pesan wajib diisi'
      });
    }

    // Jangan buat notifikasi untuk diri sendiri
    if (id_pengirim && id_penerima === id_pengirim) {
      return res.status(400).json({
        message: 'Tidak dapat membuat notifikasi untuk diri sendiri'
      });
    }

    const notifikasi = await Notifikasi.create({
      id_penerima,
      id_pengirim: id_pengirim || null,
      id_postingan: id_postingan || null,
      id_komentar: id_komentar || null,
      tipe,
      judul,
      pesan,
      dibaca: false
    });

    // Ambil notifikasi dengan relasi untuk response
    const notifikasiWithRelations = await Notifikasi.findByPk(notifikasi.id, {
      include: [
        {
          model: Pengguna,
          as: 'pengirim',
          attributes: ['id', 'nama', 'email']
        },
        {
          model: Postingan,
          as: 'postingan',
          attributes: ['id', 'judul']
        },
        {
          model: Komentar,
          as: 'komentar',
          attributes: ['id', 'konten']
        }
      ]
    });

    res.status(201).json({
      message: 'Notifikasi berhasil dibuat',
      notifikasi: notifikasiWithRelations
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      message: 'Gagal membuat notifikasi',
      error: error.message
    });
  }
};

// PUT menandai notifikasi sebagai sudah dibaca
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const id_penerima = req.user.id;

    const notifikasi = await Notifikasi.findOne({
      where: {
        id,
        id_penerima // Pastikan user hanya bisa update notifikasi miliknya
      }
    });

    if (!notifikasi) {
      return res.status(404).json({
        message: 'Notifikasi tidak ditemukan'
      });
    }

    await notifikasi.update({ dibaca: true });

    res.json({
      message: 'Notifikasi berhasil ditandai sebagai dibaca',
      notifikasi
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      message: 'Gagal menandai notifikasi sebagai dibaca',
      error: error.message
    });
  }
};

// PUT menandai semua notifikasi sebagai sudah dibaca
const markAllAsRead = async (req, res) => {
  try {
    const id_penerima = req.user.id;

    await Notifikasi.update(
      { dibaca: true },
      {
        where: {
          id_penerima,
          dibaca: false
        }
      }
    );

    res.json({
      message: 'Semua notifikasi berhasil ditandai sebagai dibaca'
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      message: 'Gagal menandai semua notifikasi sebagai dibaca',
      error: error.message
    });
  }
};

// Helper function untuk membuat notifikasi like
const createLikeNotification = async (id_pengirim, id_penerima, id_postingan, nama_pengirim, judul_postingan) => {
  try {
    if (id_pengirim === id_penerima) return; // Jangan buat notifikasi untuk diri sendiri

    await Notifikasi.create({
      id_penerima,
      id_pengirim,
      id_postingan,
      tipe: 'like',
      judul: 'Postingan Anda Mendapat Upvote',
      pesan: `${nama_pengirim} memberikan upvote pada postingan Anda: "${judul_postingan}"`,
      dibaca: false
    });
  } catch (error) {
    console.error('Error creating like notification:', error);
  }
};

// Helper function untuk membuat notifikasi comment
const createCommentNotification = async (id_pengirim, id_penerima, id_postingan, id_komentar, nama_pengirim, judul_postingan) => {
  try {
    if (id_pengirim === id_penerima) return; // Jangan buat notifikasi untuk diri sendiri

    await Notifikasi.create({
      id_penerima,
      id_pengirim,
      id_postingan,
      id_komentar,
      tipe: 'comment',
      judul: 'Komentar Baru',
      pesan: `${nama_pengirim} mengomentari postingan Anda: "${judul_postingan}"`,
      dibaca: false
    });
  } catch (error) {
    console.error('Error creating comment notification:', error);
  }
};

module.exports = {
  getAllNotifikasi,
  createNotifikasi,
  markAsRead,
  markAllAsRead,
  createLikeNotification,
  createCommentNotification,
};
