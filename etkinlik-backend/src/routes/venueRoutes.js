import express from "express";

import {
    getUniqueCities,
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenue,
    deleteVenue
} from "../controllers/venueController.js";

const router = express.Router();

router.get('/cities', getUniqueCities);

/**
 * @swagger
 * /api/venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Tüm mekanları listeler.
 *     responses:
 *       200:
 *         description: Mekanlar başarıyla getirildi.
 */

router.get("/", getAllVenues);

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: ID'ye göre mekan getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mekan ID bilgisi.
 *     responses:
 *       200:
 *         description: Mekan başarıyla getirildi.
 *       404:
 *         description: Mekan bulunamadı.
 */

router.get("/:id", getVenueById);

/**
 * @swagger
 * /api/venues:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Yeni mekan oluşturur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mekan_adi
 *               - adres
 *               - sehir
 *               - kapasite
 *             properties:
 *               mekan_adi:
 *                 type: string
 *                 example: Ankara Spor Salonu
 *               adres:
 *                 type: string
 *                 example: Altındağ / Ankara
 *               sehir:
 *                 type: string
 *                 example: Ankara
 *               kapasite:
 *                 type: integer
 *                 example: 5000
 *     responses:
 *       201:
 *         description: Mekan başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz veya eksik bilgi.
 */

router.post("/", createVenue);

/**
 * @swagger
 * /api/venues/{id}:
 *   put:
 *     tags:
 *       - Venues
 *     summary: Mekan bilgilerini günceller.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek mekan ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mekan_adi:
 *                 type: string
 *                 example: Ankara Spor Salonu
 *               adres:
 *                 type: string
 *                 example: Altındağ / Ankara
 *               sehir:
 *                 type: string
 *                 example: Ankara
 *               kapasite:
 *                 type: integer
 *                 example: 5000
 *     responses:
 *       200:
 *         description: Mekan başarıyla güncellendi.
 *       404:
 *         description: Mekan bulunamadı.
 */

router.put("/:id", updateVenue);

/**
 * @swagger
 * /api/venues/{id}:
 *   delete:
 *     tags:
 *       - Venues
 *     summary: Mekanı siler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek mekan ID'si.
 *     responses:
 *       200:
 *         description: Mekan başarıyla silindi.
 *       404:
 *         description: Mekan bulunamadı.
 */


router.delete("/:id", deleteVenue);

export default router;