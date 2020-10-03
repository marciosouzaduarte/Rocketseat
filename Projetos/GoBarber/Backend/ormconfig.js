require('dotenv').config();

module.exports = {
  type: process.env.DBtype,
  host: process.env.DBhost,
  port: process.env.DBport,
  username: process.env.DBusername,
  password: process.env.DBpassword,
  database: process.env.DBdatabase,
  entities: ['./src/models/*ts'],
  migrations: ['./src/shared/infra/database/migrations/*ts'],
  cli: {
    migrationsDir: './src/shared/infra/database/migrations',
  },
};
