require("dotenv").config();

CONFIG = {};

CONFIG.port = process.env.PORT || "3000";
CONFIG.db_dialect = process.env.DB_DIALECT;
CONFIG.db_host = process.env.DB_HOST;
CONFIG.db_port = process.env.DB_PORT;
CONFIG.db_name = process.env.DB_NAME;
CONFIG.db_user = process.env.DB_USER;
CONFIG.db_password = process.env.DB_PASSWORD;

CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION || "ritkam";
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || 60000;
