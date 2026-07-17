import pool from "../config/db.js";

// Tüm biletleri getir

export const getAllTickets = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                b.bilet_id,

                k.user_id,

                e.event_id,

                e.etkinlik_adi,

                b.koltuk_no,

                b.fiyat,

                b.olusturma_tarihi

            FROM bilet b

            JOIN kayit k
                ON b.kayit_id = k.kayit_id

            JOIN etkinlik e
                ON k.event_id = e.event_id

            ORDER BY b.bilet_id
            `

        );

        res.status(200).json({

            success: true,

            count: result.rows.length,

            data: result.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Biletler getirilemedi."

        });

    }

};

// ID'ye göre bilet getir

export const getTicketById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT

                b.bilet_id,

                k.user_id,

                e.event_id,

                e.etkinlik_adi,

                e.baslangic_tarihi,

                e.bitis_tarihi,

                b.koltuk_no,

                b.fiyat,

                b.olusturma_tarihi

            FROM bilet b

            JOIN kayit k
                ON b.kayit_id = k.kayit_id

            JOIN etkinlik e
                ON k.event_id = e.event_id

            WHERE b.bilet_id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Bilet bulunamadı."

            });

        }

        res.status(200).json({

            success: true,

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Bilet getirilemedi."

        });

    }

};


// Giriş yapan kullanıcının biletlerini getir

export const getMyTickets = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const result = await pool.query(

            `
            SELECT

                b.bilet_id,

                e.etkinlik_adi,

                e.baslangic_tarihi,

                e.bitis_tarihi,

                b.koltuk_no,

                b.fiyat,

                b.olusturma_tarihi

            FROM bilet b

            JOIN kayit k
                ON b.kayit_id = k.kayit_id

            JOIN etkinlik e
                ON k.event_id = e.event_id

            WHERE k.user_id = $1

            ORDER BY b.olusturma_tarihi DESC
            `,

            [user_id]

        );

        res.status(200).json({

            success: true,

            count: result.rows.length,

            data: result.rows

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Biletler getirilemedi."

        });

    }

};