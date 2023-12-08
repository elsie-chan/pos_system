import dotenv from 'dotenv';
dotenv.config();

export default {
    ENV: process.env.ENV,
    PORT: process.env.PORT,
    URL: process.env.URL,
    MONGO_URI: process.env.DATABASE_URL ,
    JWT_ACCESS: process.env.JWT_ACCESS_TOKEN,
    JWT_REFRESH: process.env.JWT_REFRESH_TOKEN,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    JWT_TOKEN_ACTIVE: process.env.JWT_TOKEN_ACTIVE,
    GG_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GG_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GG_CALLBACK_URL: process.env.CLIENT_CALLBACK_URL,
    EMAIL_HOST: process.env.SMTP_HOST,
    EMAIL_PORT: process.env.SMTP_PORT,
    EMAIL_USER: process.env.MAIL,
    EMAIL_PASS: process.env.MAIL_PASSWORD,
}