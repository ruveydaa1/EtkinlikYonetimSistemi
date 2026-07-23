import express from "express";

import {
    getAllEvents,
    getEventById,
    getMyEvents,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/eventController.js";

import { authenticateToken, authorizeOrganizer } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Tüm etkinlikleri listeler.
 *     responses:
 *       200:
 *         description: Etkinlikler başarıyla getirildi.
 */

router.get("/", getAllEvents);


router.get(
    "/my-events",
    authenticateToken,
    authorizeOrganizer,
    getMyEvents
);
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: ID'ye göre etkinlik getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Etkinlik ID bilgisi.
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla getirildi.
 *       404:
 *         description: Etkinlik bulunamadı.
 */

router.get("/:id", getEventById);

/**
 * @swagger
 * /api/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Yeni etkinlik oluşturur.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - mekan_id
 *               - etkinlik_adi
 *               - baslangic_tarihi
 *               - bitis_tarihi
 *               - fiyat
 *               - max_katilimci_sayisi
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               mekan_id:
 *                 type: integer
 *                 example: 2
 *               etkinlik_adi:
 *                 type: string
 *                 example: Yazılım Zirvesi
 *               aciklama:
 *                 type: string
 *                 example: Yazılım ve teknoloji etkinliği.
 *               baslangic_tarihi:
 *                 type: string
 *                 example: "2026-08-15 10:00:00"
 *               bitis_tarihi:
 *                 type: string
 *                 example: "2026-08-15 18:00:00"
 *               fiyat:
 *                 type: number
 *                 example: 250
 *               max_katilimci_sayisi:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       201:
 *         description: Etkinlik başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz bilgiler.
 *       401:
 *         description: Giriş yapılmamış.
 *       403:
 *         description: Sadece organizatör oluşturabilir.
 */

router.post("/",authenticateToken ,authorizeOrganizer ,createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Etkinlik bilgilerini günceller.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek etkinlik ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               mekan_id:
 *                 type: integer
 *                 example: 2
 *               etkinlik_adi:
 *                 type: string
 *                 example: Güncellenmiş Etkinlik
 *               aciklama:
 *                 type: string
 *                 example: Güncellenmiş açıklama.
 *               baslangic_tarihi:
 *                 type: string
 *                 example: "2026-08-20 10:00:00"
 *               bitis_tarihi:
 *                 type: string
 *                 example: "2026-08-20 18:00:00"
 *               fiyat:
 *                 type: number
 *                 example: 300
 *               max_katilimci_sayisi:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla güncellendi.
 *       401:
 *         description: Giriş yapılmamış.
 *       403:
 *         description: Yetkisiz işlem.
 *       404:
 *         description: Etkinlik bulunamadı.
 */

router.put("/:id",authenticateToken, authorizeOrganizer, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Etkinliği siler.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek etkinlik ID'si.
 *     responses:
 *       200:
 *         description: Etkinlik başarıyla silindi.
 *       401:
 *         description: Giriş yapılmamış.
 *       403:
 *         description: Yetkisiz işlem.
 *       404:
 *         description: Etkinlik bulunamadı.
 */

router.delete("/:id", authenticateToken, authorizeOrganizer, deleteEvent);

export default router;