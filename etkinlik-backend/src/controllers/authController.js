import pool from "../config/db.js";
import jwt from "jsonwebtoken";

/*
    POST /api/auth/login
*/

export const login = async (req, res) => {

    try {

        const {

            email,
            sifre

        } = req.body;

        // Boş kontrolü

        if (!email || !sifre) {

            return res.status(400).json({

                success: false,

                message: "Email ve şifre zorunludur."

            });

        }

        // Kullanıcı var mı?

        const result = await pool.query(

            `
            SELECT *

            FROM kullanici

            WHERE email=$1
            `,

            [email]

        );

        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Email veya şifre hatalı."

            });

        }

        const user = result.rows[0];

        // Şifre kontrolü

        if (user.sifre !== sifre) {

            return res.status(401).json({

                success: false,

                message: "Email veya şifre hatalı."

            });

        }

        // JWT oluştur

        const token = jwt.sign(

            {

                user_id: user.user_id,

                email: user.email,

                rol: user.rol

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1h"

            }

        );

        res.status(200).json({

            success: true,

            message: "Giriş başarılı.",

            token,

            user: {

                user_id: user.user_id,

                ad: user.ad,

                soyad: user.soyad,

                email: user.email,

                rol: user.rol

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Giriş yapılamadı."

        });

    }

};