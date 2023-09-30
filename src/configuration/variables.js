import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT,
    URL: process.env.URL,
    MONGO_URI: process.env.DATABASE_URL ,
    JWT_ACCESS: process.env.JWT_ACCESS_TOKEN,
    JWT_REFRESH: process.env.JWT_REFRESH_TOKEN,
    JWT_EXPIRES: process.env.JWT_EXPIRES,
    EMAIL_HOST: process.env.SMTP_HOST,
    EMAIL_PORT: process.env.SMTP_PORT,
    EMAIL_USER: process.env.MAIL,
    EMAIL_PASS: process.env.MAIL_PASSWORD,
}