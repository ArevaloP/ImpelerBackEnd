const {response} = require('express');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const date = require('moment');

const { dbConnection } = require('../config/db');
const {generarJWT} = require ('../helpers/jwt');
const {GoogleVerify} = require ('../helpers/verify-social-login')



const crearUsuario = async (req, res = response)=>{

    const {email, nombre, password, apellido} = req.body;

    try{

        const Uid = uniqid('ICU-');

        console.log(Uid);



        //Verificar e_mail
        let {rowCount} = await dbConnection.query(`SELECT e_mail FROM usuario
                                                WHERE lower($1) = e_mail`, [email]);



        if(rowCount != 0){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese e_mail'
            });
        }



        //Hashear la contraseña

        const salt = bcrypt.genSaltSync();
        const pass = bcrypt.hashSync(password, salt);


        //Generar Json WebToken
        const token = await generarJWT(Uid, nombre);

        
        //Generar fecha actual de la ceracion del usuario
        const fecha_actual = date().format('YYYY-MM-DD');

        //generar la consulta para la insersion de los datos a la BD
        await dbConnection.query (`INSERT INTO usuario (identificador, nombre, e_mail, contraseña, apellido, provedor, fec_cre)
                                                VALUES($1,$2,$3,$4, $5, $6, $7)`, [Uid, nombre, email, pass, apellido, 'Impeler Consulting', fecha_actual]);


        //Generar la respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: Uid,
            nombre,
            apellido,
            email,
            token
        });

    }catch(error){
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error'
        });
    }

}



const LoginUsuario = async (req, res = response)=>{

    const {email, password} = req.body;

    try{

        const {rows, rowCount} = await dbConnection.query(`SELECT * FROM usuario
                                                    WHERE e_mail = $1`, [email]);



        if (rowCount==0){
            return res.status(400).json({
                ok: false,
                msg: 'El correo o la contraseña son incorrectos'
            });
        }

        //Confirmar si el pass hace match

        const validPass = bcrypt.compareSync(password, rows[0].contraseña);

        if (!validPass){
            return res.status(400).json({
                ok: false,
                msg: 'El correo o la contraseña son incorrectos'
            });
        }

        //Generar el JWT
        const token = await generarJWT(rows[0].identificador, rows[0].nombre);


        //Respuesta del servicio

        return res.json({
            ok: true,
            uid: rows[0].identificador,
            nombre: rows[0].nombre,
            apellido: rows[0].apellido,
            email,
            token
        })


    }catch(error){
        console.log(eror);
        return res.status(500).json({
            ok: false,
            msg: 'Error'
        });
    }


}

const ValidarEmail = async (req, res =response)=>{
    const {email} = req.body;
    try{
        let {rows, rowCount} = await dbConnection.query(`SELECT * FROM usuario
                                                WHERE lower($1) = e_mail`, [email]);

        if(rowCount == 0){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no está registrado'
            });
        }else{
            return res.json({
                ok: true,
                msg: 'Ok',
                uid: rows[0].identificador,
                email
            })
        }
    }catch(error){
        return res.status(500).json({
            ok: false,
            msg: 'Error'
        });
    }
}

const LoginSocial = async (req, res = response) =>{

    const {nombre, email, provedor, img} = req.body; 
    
    try{


        let {rows, rowCount} = await dbConnection.query(`SELECT * FROM usuario
                                                WHERE lower($1) = e_mail`, [email]);

        

        if (rowCount == 0){
            //Crear usaurio
            const Uid = uniqid('ICU-');
            const fecha_actual = date().format('YYYY-MM-DD');

            console.log('----XXXXXXX------');
            await dbConnection.query (`INSERT INTO usuario (identificador, nombre, e_mail, contraseña, apellido, provedor, fec_cre, img)
                                                VALUES($1,$2,$3,$4, $5, $6, $7, $8)`, [Uid, nombre, email, '', '', provedor, fecha_actual, img]);
            
            
            
            //Generar el JWT
            const token = await generarJWT(Uid, nombre);
            return res.json({
                ok: true,
                uid: Uid,
                nombre,
                email,
                img,
                token
            });

        }else{
            //Generar el JWT
            const token = await generarJWT(rows[0].identificador, nombre);

            return res.json({
                ok: true,
                uid: rows[0].identificador,
                nombre,
                email,
                img,
                token
            });
        }

    }catch(error){
        return res.json.status(400).json({
            ok: false,
            msg: 'Error al iniciar sesion'
        })
    }

}



const RevalidarToken = async (req, res)=>{


    const {uid} = req;

    const {rows} = await dbConnection.query(`SELECT * FROM usuario
                                        WHERE identificador = $1`,[uid]);

    const token = await generarJWT(uid, rows[0].nombre);



    return res.json({
        ok: true,
        uid,
        nombre: rows[0].nombre,
        email: rows[0].e_mail,
        apellido: rows[0].apellido,
        img: rows[0].img,
        token
    });
}





module.exports = {
    crearUsuario,
    LoginUsuario,
    RevalidarToken, 
    LoginSocial,
    ValidarEmail
}
