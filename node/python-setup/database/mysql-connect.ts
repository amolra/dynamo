import mariadb from 'mariadb';

export const pool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'admin',
  database: 'dynamo',
});

//  Module Imports
// import mariadb
// import sys

//  Connect to MariaDB Platform
// try{
//     conn = mariadb.connect(
//         user="db_user",
//         password="db_user_passwd",
//         host="192.0.2.1",
//         port=3306,
//         database="employees"

//     )}
// except mariadb.Error as e:
//     print(f"Error connecting to MariaDB Platform: {e}")
//     sys.exit(1)

// //  Get Cursor
// cur = conn.cursor()

// import mysql.connector;

// Establish a connection to MariaDB
// conn = mysql.connector.connect(
//     user='your_username',
//     password='your_password',
//     host='localhost',
//     database='your_database'
// )

//  Create a cursor object to execute SQL queries
// cur = conn.cursor()

//  Execute SQL queries
// cur.execute("SELECT * FROM your_table")
// result = cur.fetchall()

//  Process the results
// for row in result:
    // print(row)

//  Close the cursor and connection
// cur.close()
// conn.close()

