const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./config/db');
require('dotenv').config();




const app = express();


//coneccion db

//dbConnection.query('SELECT * FROM NEGOCIOS');


//Directorio Publico
app.use(express.static('./public'));


//CORS
app.use(cors());

//Lectura y parceo del body
app.use(express.json());


//Rutas 
app.use('/api/auth', require('./routes/auth'));

app.get('*', (req, res)=>{
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`Servidor levantado en el puerto ${process.env.PORT}`);
});

