import express from "express";
import { getAllCategories,getCategoryById,createCategory,updateCategory,deleteCategory } from "../controllers/categoryController.js";

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Tüm kategorileri listeler.
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla getirildi.
 */

// Tüm kategorileri getir
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags:
 *       - Categories
 *     summary: ID'ye göre kategori getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kategori ID bilgisi.
 *     responses:
 *       200:
 *         description: Kategori başarıyla getirildi.
 *       404:
 *         description: Kategori bulunamadı.
 */

router.get("/:id", getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Yeni kategori oluşturur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kategori_adi
 *             properties:
 *               kategori_adi:
 *                 type: string
 *                 example: Konser
 *     responses:
 *       201:
 *         description: Kategori başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz veya eksik bilgi.
 */

router.post("/", createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Kategori bilgilerini günceller.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek kategori ID'si.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kategori_adi:
 *                 type: string
 *                 example: Tiyatro
 *     responses:
 *       200:
 *         description: Kategori başarıyla güncellendi.
 *       404:
 *         description: Kategori bulunamadı.
 */

router.put("/:id", updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags:
 *       - Categories
 *     summary: Kategoriyi siler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek kategori ID'si.
 *     responses:
 *       200:
 *         description: Kategori başarıyla silindi.
 *       404:
 *         description: Kategori bulunamadı.
 */

router.delete("/:id", deleteCategory);

export default router;