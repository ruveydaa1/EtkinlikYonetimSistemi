import express from "express";

import {

    getAllRegistrations,

    getRegistrationById,

    createRegistration,

    updateRegistration,

    getMyRegistrations,

    getEventRegistrations,

    deleteRegistration

} from "../controllers/registrationController.js";

import { authenticateToken ,authorizeOrganizer} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     tags:
 *       - Registrations
 *     summary: Tüm etkinlik kayıtlarını listeler.
 *     responses:
 *       200:
 *         description: Kayıtlar başarıyla getirildi.
 */

router.get("/", getAllRegistrations);

/**
 * @swagger
 * /api/registrations/my:
 *   get:
 *     tags:
 *       - Registrations
 *     summary: Giriş yapan kullanıcının etkinlik kayıtlarını getirir.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının kayıtları başarıyla getirildi.
 *       401:
 *         description: Yetkilendirme başarısız.
 */

router.get("/my", authenticateToken, getMyRegistrations);

/**
 * @swagger
 * /api/registrations/event/{event_id}:
 *   get:
 *     tags:
 *       - Registrations
 *     summary: Bir etkinliğe ait tüm kayıtları getirir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Etkinlik ID bilgisi.
 *     responses:
 *       200:
 *         description: Etkinlik kayıtları başarıyla getirildi.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       403:
 *         description: Sadece organizatör erişebilir.
 */

router.get("/event/:event_id", authenticateToken, authorizeOrganizer, getEventRegistrations);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     tags:
 *       - Registrations
 *     summary: ID'ye göre kayıt bilgisi getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kayıt ID bilgisi.
 *     responses:
 *       200:
 *         description: Kayıt başarıyla getirildi.
 *       404:
 *         description: Kayıt bulunamadı.
 */

router.get("/:id", getRegistrationById);

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     tags:
 *       - Registrations
 *     summary: Etkinliğe kayıt oluşturur.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Kayıt başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz istek.
 *       401:
 *         description: Yetkilendirme başarısız.
 */

router.post("/",authenticateToken ,createRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   put:
 *     tags:
 *       - Registrations
 *     summary: Kayıt durumunu günceller (Onay / Red).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kayıt ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               durum:
 *                 type: string
 *                 enum:
 *                 - BEKLEMEDE
 *                 - ONAYLANDI
 *                 - REDDEDILDI
 *                 - IPTAL
 *                 example: ONAYLANDI
 *     responses:
 *       200:
 *         description: Kayıt başarıyla güncellendi.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       403:
 *         description: Sadece organizatör güncelleyebilir.
 *       404:
 *         description: Kayıt bulunamadı.
 */

router.put("/:id",authenticateToken,authorizeOrganizer, updateRegistration);

/**
 * @swagger
 * /api/registrations/{id}:
 *   delete:
 *     tags:
 *       - Registrations
 *     summary: Etkinlik kaydını siler.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kayıt ID'si.
 *     responses:
 *       200:
 *         description: Kayıt başarıyla silindi.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       404:
 *         description: Kayıt bulunamadı.
 */

router.delete("/:id",authenticateToken, deleteRegistration);

export default router;