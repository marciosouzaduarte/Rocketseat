require('dotenv').config();

module.exports = [
  {
    "name": process.env.SQL_name,
    "type": process.env.SQL_type,
    "host": process.env.SQL_host,
    "port": process.env.SQL_port,
    "username": process.env.SQL_user,
    "password": process.env.SQL_pass,
    "database": process.env.SQL_database,
    "entities": ['./src/models/*ts'],
    "migrations": ['./src/shared/infra/database/migrations/*ts'],
    "cli": {
      "migrationsDir": './src/shared/infra/database/migrations',
    },
  },
  {
    "name": process.env.NoSQL_name,
    "type": process.env.NoSQL_type,
    "host": process.env.NoSQL_host,
    "port": process.env.NoSQL_port,
    "username": process.env.NoSQL_user,
    "password": process.env.NoSQL_pass,
    "useUnifiedTopology": true,
    "useNewUrlParser": true,
    "database": process.env.NoSQL_database,
    "entities": ['./src/schemas/*ts'],
  }
];
