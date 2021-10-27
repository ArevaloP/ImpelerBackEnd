const {Pool} = require('pg');


const dbConnection =  new Pool ({
                    host:'ec2-54-161-238-249.compute-1.amazonaws.com',
                    user: 'mpgaphjmhixjnw',
                    password: '8d0e5f737b50bdf2c96fd30147979551eca4a26f4daa1ede9841a17e485f636e',
                    database: 'd14s3lmpjum0o2',
                    port: '5432',
                    ssl: {
                        rejectUnauthorized: false
                    }
                }); 


module.exports = {
    dbConnection
}