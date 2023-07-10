import dotenv from "dotenv"
dotenv.config()



export const production = {
  mongodb_connection_url: process.env.PRODUCTION_MONGODB_CONNECTION_URL,
  bycrypt_salt_round: +process.env.PRODUCTION_BCRYPT_SALT_ROUND,
  jwt_secret_key: process.env.PRODUCTION_JWT_SECRET,
  port:+process.env.PORT,
  mail_trap_username: process.env.PROD_MAIL_TRAP_USERNAME,
  mail_trap_password: process.env.PROD_MAIL_TRAP_PASSWORD
}