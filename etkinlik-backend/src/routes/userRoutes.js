import express from "express";

import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    changePassword,
    deleteUser
} from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Tüm kullanıcıları getirir.
 *     responses:
 *       200:
 *         description: Kullanıcılar başarıyla listelendi.
 */

router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: ID'ye göre kullanıcı getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kullanıcı ID bilgisi.
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla getirildi.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */

router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Yeni kullanıcı (hesap) oluşturur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ad
 *               - soyad
 *               - email
 *               - sifre
 *               - rol
 *             properties:
 *               ad:
 *                 type: string
 *                 example: Ali
 *               soyad:
 *                 type: string
 *                 example: Yılmaz
 *               email:
 *                 type: string
 *                 example: ali@gmail.com
 *               sifre:
 *                 type: string
 *                 example: 1234
 *               telefon:
 *                 type: string
 *                 example: 5551234567
 *               rol:
 *                 type: string
 *                 example: KULLANICI
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz veya eksik bilgiler.
 */

router.post("/", createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Kullanıcı bilgilerini günceller.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kullanıcı ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ad:
 *                 type: string
 *                 example: Ahmet
 *               soyad:
 *                 type: string
 *                 example: Kaya
 *               email:
 *                 type: string
 *                 example: ahmet@gmail.com
 *               sifre:
 *                 type: string
 *                 example: 1234
 *               telefon:
 *                 type: string
 *                 example: "5551234567"
 *               rol:
 *                 type: string
 *                 example: KULLANICI
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla güncellendi.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */


router.put("/:id", updateUser);

router.put("/:id/change-password", changePassword);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Kullanıcıyı siler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kullanıcı ID'si.
 *     responses:
 *       200:
 *         description: Kullanıcı başarıyla silindi.
 *       404:
 *         description: Kullanıcı bulunamadı.
 */

router.delete("/:id", deleteUser);

export default router;