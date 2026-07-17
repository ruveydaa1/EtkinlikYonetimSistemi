import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({

            success: false,

            message: "Token bulunamadı."

        });

    }

    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({

            success: false,

            message: "Geçersiz token."

        });

    }

    try {

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        req.user = decoded;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Token geçersiz."

        });

    }

};

export const authorizeOrganizer = (req, res, next) => {

    if (req.user.rol !== "ORGANIZATOR") {

        return res.status(403).json({

            success: false,

            message: "Bu işlem için organizatör yetkisi gereklidir."

        });

    }

    next();

};