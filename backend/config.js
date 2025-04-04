require('dotenv').config();

let {
  APS_CLIENT_ID,
  APS_CLIENT_SECRET,
  APS_BUCKET,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  JWT_SECRET
} = process.env;

if (!APS_CLIENT_ID || !APS_CLIENT_SECRET) {
  console.warn('Missing some of the APS environment variables.');
  process.exit(1);
}

APS_BUCKET = APS_BUCKET || `${APS_CLIENT_ID.toLowerCase()}-basic-app`;
PORT = PORT || 8080;

module.exports = {
  APS_CLIENT_ID,
  APS_CLIENT_SECRET,
  APS_BUCKET,
  PORT,
  dbConfig: {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
  },
  jwtSecret: JWT_SECRET
};
