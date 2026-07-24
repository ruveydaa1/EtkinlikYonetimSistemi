import pool from "../config/db.js";

export const getAllUsers = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                user_id,
                ad,
                soyad,
                email,
                telefon,
                rol
            FROM kullanici
            ORDER BY user_id
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
            message: "Kullanıcılar getirilemedi."
        });

    }

};

export const getUserById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                user_id,
                ad,
                soyad,
                email,
                telefon,
                rol
            FROM kullanici
            WHERE user_id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kullanıcı bulunamadı."
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
            message: "Kullanıcı getirilemedi."
        });

    }

};

/*
    POST /api/users
*/

export const createUser = async (req, res) => {

    try {

        const {

            ad,
            soyad,
            email,
            sifre,
            telefon,
            rol

        } = req.body;

        if (
            !ad ||
            !soyad ||
            !email ||
            !sifre ||
            !rol
        ) {

            return res.status(400).json({

                success: false,

                message: "Zorunlu alanlar eksik."

            });

        }

        // Ad ve soyad kontrolü

        const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ]+$/;

        if (
            ad.length < 2 ||
            soyad.length < 2 ||
            !nameRegex.test(ad) ||
            !nameRegex.test(soyad)
        ) {

            return res.status(400).json({

                success: false,

                message: "Ad ve soyad sadece harflerden oluşmalı ve en az 2 karakter olmalıdır."

            });

        }


        // Email format kontrolü

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            return res.status(400).json({

                success: false,

                message: "Geçerli bir e-posta adresi giriniz."

            });

        }


        // Şifre uzunluk kontrolü

        if (sifre.length < 4) {

            return res.status(400).json({

                success: false,

                message: "Şifre en az 4 karakter olmalıdır."

            });

        }


        // Telefon girildiyse kontrol et

        if (telefon) {

            const phoneRegex = /^[0-9]{10}$/;

            if (!phoneRegex.test(telefon)) {

                return res.status(400).json({

                    success: false,

                    message: "Telefon numarası 10 haneli olmalıdır."

                });

            }

        }


        // Rol kontrolü

        if (rol !== "KULLANICI" && rol !== "ORGANIZATOR") {

            return res.status(400).json({

                success: false,

                message: "Geçersiz rol bilgisi."

            });

        }



        if (rol !== "KULLANICI" && rol !== "ORGANIZATOR") {

            return res.status(400).json({

                success: false,

                message: "Geçersiz rol bilgisi."

            });

        }

        // Email daha önce kayıtlı mı?

        const emailControl = await pool.query(

            "SELECT * FROM kullanici WHERE email = $1",

            [email]

        );

        if (emailControl.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Bu e-posta adresi zaten kayıtlı."

            });

        }

        const result = await pool.query(

            `
            INSERT INTO kullanici
            (
                ad,
                soyad,
                email,
                sifre,
                telefon,
                rol
            )

            VALUES

            ($1,$2,$3,$4,$5,$6)

            RETURNING
                user_id,
                ad,
                soyad,
                email,
                telefon,
                rol

            `,

            [

                ad,

                soyad,

                email,

                sifre,

                telefon,

                rol

            ]

        );

        res.status(201).json({

            success: true,

            message: "Kullanıcı oluşturuldu.",

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kullanıcı oluşturulamadı."

        });

    }

};

/*
    PUT /api/users/:id
*/

export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            ad,
            soyad,
            email,
            telefon,
            rol

        } = req.body;

        if (
            !ad ||
            !soyad ||
            !email ||
            !rol
        ) {

            return res.status(400).json({

                success: false,

                message: "Zorunlu alanlar eksik."

            });

        }

        // Aynı email başka kullanıcıda var mı?

        const emailControl = await pool.query(

            `
            SELECT *
            FROM kullanici
            WHERE email = $1
            AND user_id <> $2
            `,

            [email, id]

        );

        if (emailControl.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Bu e-posta adresi başka bir kullanıcı tarafından kullanılıyor."

            });

        }

        const result = await pool.query(

            `
            UPDATE kullanici

            SET

                ad=$1,

                soyad=$2,

                email=$3,

                telefon=$4,

                rol=$5

            WHERE user_id=$6

            RETURNING

                user_id,
                ad,
                soyad,
                email,
                telefon,
                rol

            `,

            [

                ad,

                soyad,

                email,

                telefon,

                rol,

                id

            ]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kullanıcı bulunamadı."

            });

        }

        res.status(200).json({

            success: true,

            message: "Kullanıcı güncellendi.",

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kullanıcı güncellenemedi."

        });

    }

};

/*
    PUT /api/users/:id/change-password
*/

export const changePassword = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            currentPassword,
            newPassword

        } = req.body;

        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message: "Zorunlu alanlar eksik."

            });

        }

        const userResult = await pool.query(

            `
            SELECT sifre
            FROM kullanici
            WHERE user_id = $1
            `,

            [id]

        );

        if (userResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kullanıcı bulunamadı."

            });

        }

        const currentDbPassword = userResult.rows[0].sifre;

        if (currentDbPassword !== currentPassword) {

            return res.status(400).json({

                success: false,

                message: "Mevcut şifre hatalı."

            });

        }

        if (newPassword.length < 4) {

            return res.status(400).json({

                success: false,

                message: "Yeni şifre en az 4 karakter olmalıdır."

            });

        }

        if (currentPassword === newPassword) {

            return res.status(400).json({

                success: false,

                message: "Yeni şifre mevcut şifre ile aynı olamaz."

            });

        }

        await pool.query(

            `
            UPDATE kullanici
            SET sifre = $1
            WHERE user_id = $2
            `,

            [

                newPassword,

                id

            ]

        );

        res.status(200).json({

            success: true,

            message: "Şifre başarıyla güncellendi."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Şifre güncellenemedi."

        });

    }

};

/*
    DELETE /api/users/:id
*/

export const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            DELETE FROM kullanici

            WHERE user_id = $1

            RETURNING *

            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kullanıcı bulunamadı."

            });

        }

        res.status(200).json({

            success: true,

            message: "Kullanıcı silindi."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kullanıcı silinemedi."

        });

    }

};