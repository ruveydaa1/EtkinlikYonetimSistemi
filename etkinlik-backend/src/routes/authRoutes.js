import express from "express";

import { login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Kullanıcı girişi
 *     description: Kullanıcının e-posta ve şifresi ile giriş yapmasını sağlar ve JWT token döndürür.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - sifre
 *             properties:
 *               email:
 *                 type: string
 *                 example: ali@gmail.com
 *               sifre:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Giriş başarılı.
 *       401:
 *         description: E-posta veya şifre hatalı.
 */

router.post("/login", login);

export default router;