import pool from "../config/db.js";

/*
    GET /api/venues
*/
export const getAllVenues = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM mekan
            ORDER BY mekan_id
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
            message: "Mekanlar alınamadı."
        });

    }

};

/*
    GET /api/venues/:id
*/
export const getVenueById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM mekan
            WHERE mekan_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Mekan bulunamadı."
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
            message: "Mekan getirilemedi."
        });

    }

};

/*
    POST /api/venues
*/
export const createVenue = async (req, res) => {

    try {

        const {
            mekan_adi,
            adres,
            sehir,
            kapasite
        } = req.body;

        if (!mekan_adi || !adres || !kapasite) {
            return res.status(400).json({
                success: false,
                message: "Mekan adı, adres ve kapasite zorunludur."
            });
        }

        const result = await pool.query(
            `
            INSERT INTO mekan
            (mekan_adi, adres, sehir, kapasite)
            VALUES($1,$2,$3,$4)
            RETURNING *
            `,
            [
                mekan_adi,
                adres,
                sehir,
                kapasite
            ]
        );

        res.status(201).json({
            success: true,
            message: "Mekan oluşturuldu.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Mekan oluşturulamadı."
        });

    }

};

/*
    PUT /api/venues/:id
*/
export const updateVenue = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            mekan_adi,
            adres,
            sehir,
            kapasite
        } = req.body;

        if (!mekan_adi || !adres || !kapasite) {
            return res.status(400).json({
                success: false,
                message: "Mekan adı, adres ve kapasite zorunludur."
            });
        }

        const result = await pool.query(
            `
            UPDATE mekan
            SET
                mekan_adi=$1,
                adres=$2,
                sehir=$3,
                kapasite=$4
            WHERE mekan_id=$5
            RETURNING *
            `,
            [
                mekan_adi,
                adres,
                sehir,
                kapasite,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Mekan bulunamadı."
            });
        }

        res.status(200).json({
            success: true,
            message: "Mekan güncellendi.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Mekan güncellenemedi."
        });

    }

};

/*
    DELETE /api/venues/:id
*/
export const deleteVenue = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM mekan
            WHERE mekan_id=$1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Mekan bulunamadı."
            });
        }

        res.status(200).json({
            success: true,
            message: "Mekan silindi."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Mekan silinemedi."
        });

    }

};

/*
    GET /api/venues/cities
*/
export const getUniqueCities = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT sehir 
            FROM mekan 
            WHERE sehir IS NOT NULL 
            ORDER BY sehir
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
            message: "Şehirler alınamadı."
        });
    }
};