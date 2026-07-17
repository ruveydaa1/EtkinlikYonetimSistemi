import pool from "../config/db.js";

export const getAllCategories = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM kategori
            ORDER BY category_id
        `);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Kategoriler alınırken bir hata oluştu."
        });

    }

};

export const getCategoryById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `SELECT *
             FROM kategori
             WHERE category_id=$1`,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı."
            });

        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Kategori getirilemedi."
        });

    }

};

/*
    POST /api/categories
*/
export const createCategory = async (req, res) => {

    try {

        const { kategori_adi } = req.body;

        if (!kategori_adi || kategori_adi.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Kategori adı boş olamaz."
            });

        }

        const result = await pool.query(
            `
            INSERT INTO kategori(kategori_adi)
            VALUES($1)
            RETURNING *
            `,
            [kategori_adi]
        );

        res.status(201).json({
            success: true,
            message: "Kategori başarıyla oluşturuldu.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Kategori oluşturulamadı."
        });

    }

};

/*
    PUT /api/categories/:id
*/
export const updateCategory = async (req, res) => {

    try {

        const { id } = req.params;
        const { kategori_adi } = req.body;

        if (!kategori_adi || kategori_adi.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Kategori adı boş olamaz."
            });

        }

        const result = await pool.query(
            `
            UPDATE kategori
            SET kategori_adi=$1
            WHERE category_id=$2
            RETURNING *
            `,
            [kategori_adi, id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı."
            });

        }

        res.status(200).json({
            success: true,
            message: "Kategori güncellendi.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Kategori güncellenemedi."
        });

    }

};

/*
    DELETE /api/categories/:id
*/
export const deleteCategory = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM kategori
            WHERE category_id=$1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı."
            });

        }

        res.status(200).json({
            success: true,
            message: "Kategori silindi."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Kategori silinemedi."
        });

    }

};