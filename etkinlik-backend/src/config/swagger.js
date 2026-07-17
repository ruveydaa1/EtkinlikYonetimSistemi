import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Etkinlik Yönetim Sistemi API",
            version: "1.0.0",
            description: `
        Etkinlik Yönetim Sistemi Backend API Dokümantasyonu.

        API'yi test etmek için izlenecek adımlar:

        1. POST /api/users endpointi ile yeni bir hesap oluşturun.
        2. POST /api/auth/login endpointi ile giriş yaparak JWT token alın.
        3. Sağ üstte bulunan Authorize butonuna tokenı girin.
        4. Yetkilendirme gerektiren endpointleri test edebilirsiniz.
        `
        },
        servers: [
            {
                url: "http://localhost:5000"
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },

    
        
    },

    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;