import pool from "../config/db.js";

// Tüm kayıtları getir

export const getAllRegistrations = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT *

            FROM kayit

            ORDER BY kayit_id
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

            message: "Kayıtlar getirilemedi."

        });

    }

};

// ID'ye göre kayıt getir

export const getRegistrationById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `
            SELECT *

            FROM kayit

            WHERE kayit_id = $1
            `,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kayıt bulunamadı."

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

            message: "Kayıt getirilemedi."

        });

    }

};

// Yeni kayıt oluştur

export const createRegistration = async (req, res) => {

    try {

        const { event_id } = req.body;

        const user_id = req.user.user_id;

        if (!event_id) {

            return res.status(400).json({

                success: false,

                message: "Etkinlik seçilmelidir."

            });

        }

        // Kullanıcının rolünü kontrol et

        const userResult = await pool.query(

            `
            SELECT rol

            FROM kullanici

            WHERE user_id = $1
            `,

            [user_id]

        );

        if (userResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kullanıcı bulunamadı."

            });

        }

        if (userResult.rows[0].rol !== "KULLANICI") {

            return res.status(403).json({

                success: false,

                message: "Sadece kullanıcılar etkinliğe kayıt olabilir."

            });

        }

        // Etkinlik var mı?

        const eventResult = await pool.query(

            `
            SELECT *

            FROM etkinlik

            WHERE event_id = $1
            `,

            [event_id]

        );

        if (eventResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        // Aynı etkinliğe daha önce kayıt olmuş mu?

        const registrationControl = await pool.query(

            `
            SELECT *

            FROM kayit

            WHERE user_id = $1

            AND event_id = $2
            `,

            [

                user_id,

                event_id

            ]

        );

        if (registrationControl.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Bu etkinliğe zaten kayıt oldunuz."

            });

        }

        // Kontenjan dolu mu?

        const participantCount = await pool.query(

            `
            SELECT COUNT(*) AS toplam

            FROM kayit

            WHERE event_id = $1

            AND durum != 'REDDEDILDI'

            `,

            [event_id]

        );

        const currentCount = Number(participantCount.rows[0].toplam);

        const maxParticipant = eventResult.rows[0].max_katilimci_sayisi;

        if (currentCount >= maxParticipant) {

            return res.status(400).json({

                success: false,

                message: "Etkinlik kontenjanı dolmuştur."

            });

        }

        // Kayıt oluştur

        const result = await pool.query(

            `
            INSERT INTO kayit
            (
                user_id,
                event_id
            )

            VALUES ($1, $2)

            RETURNING *
            `,

            [

                user_id,

                event_id

            ]

        );

        res.status(201).json({

            success: true,

            message: "Etkinliğe kayıt oluşturuldu.",

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kayıt oluşturulamadı."

        });

    }

};
// Güncelle

export const updateRegistration = async (req, res) => {

    try {

        const { id } = req.params;

        const { durum } = req.body;

        const organizer_id = req.user.user_id;

        // Sadece ONAYLANDI veya REDDEDILDI kabul edilsin

        if (durum !== "ONAYLANDI" && durum !== "REDDEDILDI") {

            return res.status(400).json({

                success: false,

                message: "Geçersiz durum bilgisi."

            });

        }

        // Kayıt var mı?

        const registrationResult = await pool.query(

            `
            SELECT *

            FROM kayit

            WHERE kayit_id = $1
            `,

            [id]

        );

        if (registrationResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kayıt bulunamadı."

            });

        }

        // Bu kayıt hangi etkinliğe ait?

        const event_id = registrationResult.rows[0].event_id;

        // Etkinliğin sahibi kim?

        const eventResult = await pool.query(

            `
            SELECT organizer_id

            FROM etkinlik

            WHERE event_id = $1
            `,

            [event_id]

        );

        if (eventResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Etkinlik bulunamadı."

            });

        }

        // Giriş yapan organizatör mü?

        if (eventResult.rows[0].organizer_id !== organizer_id) {

            return res.status(403).json({

                success: false,

                message: "Bu kayıt üzerinde işlem yapma yetkiniz yok."

            });

        }
        
        // Eğer kayıt ONAYLANIYORSA kapasite kontrolü yap

        if (

            durum === "ONAYLANDI" &&

            registrationResult.rows[0].durum !== "ONAYLANDI"

        ) {


            const capacityResult = await pool.query(

                `
                SELECT max_katilimci_sayisi

                FROM etkinlik

                WHERE event_id = $1
                `,

                [event_id]

            );


            const approvedCount = await pool.query(

                `
                SELECT COUNT(*) AS toplam

                FROM kayit

                WHERE event_id = $1

                AND durum != 'REDDEDILDI'
                
                AND kayit_id != $2
                `,

                [
                    event_id, 
                    id
                ]

            );


            const maxParticipant = capacityResult.rows[0].max_katilimci_sayisi;

            const currentCount = Number(approvedCount.rows[0].toplam);


            if (currentCount >= maxParticipant) {

                return res.status(400).json({

                    success: false,

                    message: "Etkinlik kontenjanı dolmuştur."

                });

            }

        }


        // Güncelle

        const result = await pool.query(

            `
            UPDATE kayit

            SET durum = $1

            WHERE kayit_id = $2

            RETURNING *
            `,

            [

                durum,

                id

            ]

        );

        // Eğer kayıt onaylandıysa otomatik bilet oluştur

        if (durum === "ONAYLANDI") {

            // Daha önce bilet oluşturulmuş mu?

            const ticketResult = await pool.query(

                `
                SELECT *

                FROM bilet

                WHERE kayit_id = $1
                `,

                [id]

            );

            // Yoksa oluştur

            if (ticketResult.rows.length === 0) {

              // Etkinliğin fiyatını al

              const eventResult = await pool.query(

                  `
                  SELECT fiyat

                  FROM etkinlik

                  WHERE event_id = $1
                  `,

                  [registrationResult.rows[0].event_id]

             );
                await pool.query(


                    `
                    INSERT INTO bilet
                    (
                        kayit_id,
                        koltuk_no,
                        fiyat
                    )

                    VALUES ($1, $2, $3)
                    `,

                    [
                        id,
                        null,
                        eventResult.rows[0].fiyat
                    ]

                );

            }

        }

        res.status(200).json({

            success: true,

            message: "Kayıt durumu güncellendi.",

            data: result.rows[0]

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kayıt güncellenemedi."

        });

    }

};

// Sil
export const deleteRegistration = async (req, res) => {

    try {

        const { id } = req.params;

        const user_id = req.user.user_id;

        // Kayıt var mı?

        const registrationResult = await pool.query(

            `
            SELECT *

            FROM kayit

            WHERE kayit_id = $1
            `,

            [id]

        );

        if (registrationResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Kayıt bulunamadı."

            });

        }

        // Kayıt sahibi mi?

        if (registrationResult.rows[0].user_id !== user_id) {

            return res.status(403).json({

                success: false,

                message: "Bu kaydı silme yetkiniz yok."

            });

        }

        // Sil

        await pool.query(

            `
            DELETE

            FROM kayit

            WHERE kayit_id = $1
            `,

            [id]

        );

        res.status(200).json({

            success: true,

            message: "Kayıt başarıyla silindi."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Kayıt silinemedi."

        });

    }

};

// Kullanıcının kendi etkinlik kayıtlarını getir

export const getMyRegistrations = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const result = await pool.query(

            `
            SELECT
                kayit.kayit_id,
                etkinlik.event_id,
                etkinlik.etkinlik_adi,
                etkinlik.baslangic_tarihi,
                etkinlik.bitis_tarihi,
                etkinlik.fiyat,
                kayit.durum

            FROM kayit

            INNER JOIN etkinlik

            ON kayit.event_id = etkinlik.event_id

            WHERE kayit.user_id = $1

            ORDER BY kayit.kayit_id DESC
            `,

            [user_id]

        );


        res.status(200).json({

            success: true,

            count: result.rows.length,

            data: result.rows

        });


    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Kayıtlar getirilemedi."

        });

    }

};

// Organizatörün kendi etkinliğindeki kayıtları getir

export const getEventRegistrations = async (req, res) => {

    try {

        const { event_id } = req.params;

        const organizer_id = req.user.user_id;


        // Etkinlik bu organizatöre mi ait?

        const eventControl = await pool.query(

            `
            SELECT *

            FROM etkinlik

            WHERE event_id = $1

            AND organizer_id = $2
            `,

            [
                event_id,
                organizer_id
            ]

        );


        if (eventControl.rows.length === 0) {

            return res.status(403).json({

                success:false,

                message:"Bu etkinliğe erişim yetkiniz yok."

            });

        }


        // Kayıtları getir

        const result = await pool.query(

            `
            SELECT

                kayit.kayit_id,

                kullanici.ad,

                kullanici.soyad,

                kullanici.email,

                kayit.durum


            FROM kayit


            INNER JOIN kullanici

            ON kayit.user_id = kullanici.user_id


            WHERE kayit.event_id = $1


            ORDER BY kayit.kayit_id DESC

            `,

            [event_id]

        );


        res.status(200).json({

            success:true,

            count: result.rows.length,

            data: result.rows

        });


    }

    catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:"Kayıtlar getirilemedi."

        });

    }

};