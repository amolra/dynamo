import mariadb from 'mariadb';

export const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'admin',
  database: 'dynamo',
});

// Expose a method to establish connection with MariaDB SkySQL
