import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const { Pool } = pg;

const pool = new Pool(
    isProduction
        ? {
              connectionString: process.env.DATABASE_URL,
              ssl: true,
          }
        : {
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT) || 5432,
              database: process.env.DB_NAME,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
          }
);

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

export default pool;