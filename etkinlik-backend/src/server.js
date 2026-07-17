import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {

        await pool.query("SELECT NOW()");

        console.log("PostgreSQL bağlantısı başarılı.");

        app.listen(PORT, () => {
            console.log(`Server ${PORT} portunda çalışıyor.`);
        });

    } catch (error) {

        console.error("Veritabanına bağlanılamadı.");

        console.error(error.message);

    }
};

startServer();