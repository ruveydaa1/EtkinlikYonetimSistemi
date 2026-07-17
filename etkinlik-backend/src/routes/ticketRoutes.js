import express from "express";

import { getMyTickets,getAllTickets,getTicketById } from "../controllers/ticketController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Sistemdeki tüm biletleri listeler.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Biletler başarıyla getirildi.
 *       401:
 *         description: Yetkilendirme başarısız.
 */


router.get(
    "/",
    authenticateToken,
    getAllTickets
);

/**
 * @swagger
 * /api/tickets/my:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Giriş yapan kullanıcının biletlerini getirir.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının biletleri başarıyla getirildi.
 *       401:
 *         description: Yetkilendirme başarısız.
 */

router.get(
    "/my",
    authenticateToken,
    getMyTickets
);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: ID'ye göre bilet bilgisi getirir.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Bilet ID bilgisi.
 *     responses:
 *       200:
 *         description: Bilet başarıyla getirildi.
 *       401:
 *         description: Yetkilendirme başarısız.
 *       404:
 *         description: Bilet bulunamadı.
 */

router.get(
    "/:id",
    authenticateToken,
    getTicketById
);

export default router;