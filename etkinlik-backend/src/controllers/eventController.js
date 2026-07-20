import pool from "../config/db.js";

export const getAllEvents = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT

                e.event_id,
                e.etkinlik_adi,
                e.aciklama,

                e.baslangic_tarihi,
                e.bitis_tarihi,

                e.fiyat,

                e.max_katilimci_sayisi,

                e.durum,
                e.resim,

                k.category_id,
                k.kategori_adi,

                m.mekan_id,
                m.mekan_adi,
                m.sehir,

                u.user_id,
                u.ad,
                u.soyad

            FROM etkinlik e

            INNER JOIN kategori k
                ON e.category_id = k.category_id

            INNER JOIN mekan m
                ON e.mekan_id = m.mekan_id

            INNER JOIN kullanici u
                ON e.organizer_id = u.user_id

            ORDER BY e.event_id;

        `);

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

            message: "Etkinlikler getirilemedi."

        });

    }

};

export const getEventById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT

                e.event_id,
                e.etkinlik_adi,
                e.aciklama,

                e.baslangic_tarihi,
                e.bitis_tarihi,

                e.fiyat,

                e.max_katilimci_sayisi,

                e.durum,
                e.resim,

                k.category_id,
                k.kategori_adi,

                m.mekan_id,
                m.mekan_adi,
                m.sehir,

                u.user_id,
                u.ad,
                u.soyad,
                u.ad || ' ' || u.soyad AS organizator

            FROM etkinlik e

            INNER JOIN kategori k
                ON e.category_id = k.category_id

            INNER JOIN mekan m
                ON e.mekan_id = m.mekan_id

            INNER JOIN kullanici u
                ON e.organizer_id = u.user_id

            WHERE e.event_id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

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

            message: "Etkinlik getirilemedi."

        });

    }

};

/*
    POST /api/events
*/
export const createEvent = async (req, res) => {

    try {

        const {
            category_id,
            mekan_id,
            etkinlik_adi,
            aciklama,
            baslangic_tarihi,
            bitis_tarihi,
            fiyat,
            max_katilimci_sayisi,
            durum,
            resim
        } = req.body;

        // Organizer bilgisi JWT'den geliyor
        const organizer_id = req.user.user_id;

        // Zorunlu alanlar
        if (
            !category_id ||
            !mekan_id ||
            !etkinlik_adi ||
            !baslangic_tarihi ||
            !bitis_tarihi ||
            fiyat == null ||
            max_katilimci_sayisi == null
        ) {
            return res.status(400).json({
                success: false,
                message: "Zorunlu alanlar eksik."
            });
        }

        // Fiyat kontrolü
        if (Number(fiyat) < 0) {
            return res.status(400).json({
                success: false,
                message: "Fiyat negatif olamaz."
            });
        }

        // Katılımcı kontrolü
        if (Number(max_katilimci_sayisi) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Katılımcı sayısı 0'dan büyük olmalıdır."
            });
        }

        // Tarih kontrolü
        if (new Date(baslangic_tarihi) >= new Date(bitis_tarihi)) {
            return res.status(400).json({
                success: false,
                message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır."
            });
        }

        // Kategori kontrolü
        const category = await pool.query(
            "SELECT * FROM kategori WHERE category_id = $1",
            [category_id]
        );

        if (category.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kategori bulunamadı."
            });
        }

        // Mekan kontrolü
        const venue = await pool.query(
            "SELECT * FROM mekan WHERE mekan_id = $1",
            [mekan_id]
        );

        if (venue.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Mekan bulunamadı."
            });
        }

        // Organizatör kontrolü
        const organizer = await pool.query(
            "SELECT * FROM kullanici WHERE user_id = $1",
            [organizer_id]
        );

        if (organizer.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organizatör bulunamadı."
            });
        }

        // Rol kontrolü
        if (organizer.rows[0].rol !== "ORGANIZATOR") {
            return res.status(400).json({
                success: false,
                message: "Sadece organizatör etkinlik oluşturabilir."
            });
        }

        // INSERT
        const result = await pool.query(
            `
            INSERT INTO etkinlik
            (
                organizer_id,
                category_id,
                mekan_id,
                etkinlik_adi,
                aciklama,
                baslangic_tarihi,
                bitis_tarihi,
                fiyat,
                max_katilimci_sayisi,
                durum,
                resim
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *
            `,
            [
                organizer_id,
                category_id,
                mekan_id,
                etkinlik_adi,
                aciklama,
                baslangic_tarihi,
                bitis_tarihi,
                fiyat,
                max_katilimci_sayisi,
                durum || "AKTIF",
                resim
            ]
        );

        res.status(201).json({
            success: true,
            message: "Etkinlik başarıyla oluşturuldu.",
            data: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Etkinlik oluşturulamadı."
        });

    }

};

/*
    PUT /api/events/:id
*/

export const updateEvent = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            category_id,
            mekan_id,

            etkinlik_adi,
            aciklama,

            baslangic_tarihi,
            bitis_tarihi,

            fiyat,

            max_katilimci_sayisi,

            durum,
            resim

        } = req.body;

        const organizer_id = req.user.user_id;

        // Zorunlu alanlar

        if (

            !category_id ||

            !mekan_id ||

            !etkinlik_adi ||

            !baslangic_tarihi ||

            !bitis_tarihi ||

            fiyat == null ||

            max_katilimci_sayisi == null

        ) {

            return res.status(400).json({

                success: false,

                message: "Zorunlu alanlar eksik."

            });

        }

        // Fiyat

        if (Number(fiyat) < 0) {

            return res.status(400).json({

                success: false,

                message: "Fiyat negatif olamaz."

            });

        }

        // Katılımcı

        if (Number(max_katilimci_sayisi) <= 0) {

            return res.status(400).json({

                success: false,

                message: "Katılımcı sayısı 0'dan büyük olmalıdır."

            });

        }

        // Tarih

        if (new Date(baslangic_tarihi) >= new Date(bitis_tarihi)) {

            return res.status(400).json({

                success: false,

                message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır."

            });

        }

        // Kategori

        const category = await pool.query(

            "SELECT * FROM kategori WHERE category_id=$1",

            [category_id]

        );

        if (category.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kategori bulunamadı."

            });

        }

        // Mekan

        const venue = await pool.query(

            "SELECT * FROM mekan WHERE mekan_id=$1",

            [mekan_id]

        );

        if (venue.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Mekan bulunamadı."

            });

        }

        // Organizatör

        const organizer = await pool.query(

            "SELECT * FROM kullanici WHERE user_id=$1",

            [organizer_id]

        );

        if (organizer.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Organizatör bulunamadı."

            });

        }

        if (organizer.rows[0].rol !== "ORGANIZATOR") {

            return res.status(400).json({

                success: false,

                message: "Sadece organizatör etkinlik oluşturabilir."

            });

        }



        // Etkinlik var mı ve sahibi kim?

        const eventControl = await pool.query(

            `
            SELECT organizer_id

            FROM etkinlik

            WHERE event_id = $1
            `,

            [id]

        );

        if (eventControl.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        if (eventControl.rows[0].organizer_id !== organizer_id) {

            return res.status(403).json({

                success: false,

                message: "Bu etkinliği güncelleme yetkiniz yok."

            });

        }




        // Güncelle

        const result = await pool.query(

            `
            UPDATE etkinlik

            SET


                category_id=$1,

                mekan_id=$2,

                etkinlik_adi=$3,

                aciklama=$4,

                baslangic_tarihi=$5,

                bitis_tarihi=$6,

                fiyat=$7,

                max_katilimci_sayisi=$8,

                durum=$9,
                resim=$10

            WHERE event_id=$11

            RETURNING *

            `,

            [

                category_id,

                mekan_id,

                etkinlik_adi,

                aciklama,

                baslangic_tarihi,

                bitis_tarihi,

                fiyat,

                max_katilimci_sayisi,

                durum,

                resim,

                id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        res.status(200).json({

            success: true,

            message: "Etkinlik güncellendi.",

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Etkinlik güncellenemedi."

        });

    }

};

/*
    DELETE /api/events/:id
*/

export const deleteEvent = async (req, res) => {

    try {

        const { id } = req.params;

        const organizer_id = req.user.user_id;


        const eventControl = await pool.query(

            `
            SELECT organizer_id

            FROM etkinlik

            WHERE event_id = $1
            `,

            [id]

        );

        if (eventControl.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        if (eventControl.rows[0].organizer_id !== organizer_id) {

            return res.status(403).json({

                success: false,

                message: "Bu etkinliği silme yetkiniz yok."

            });

        }



        const result = await pool.query(

            `
            DELETE FROM etkinlik

            WHERE event_id=$1

            RETURNING *

            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        res.status(200).json({

            success: true,

            message: "Etkinlik silindi."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Etkinlik silinemedi."

        });

    }

};