const {response} = require('express');
const { dbConnection } = require('../config/db');
const uniqid = require('uniqid');



const crearBuss = async (req, res=response) =>{
    
    const {razon_social,
            nit,
            forma_juridica,
            act_economica,
            sect_economico,
            direccion,
            departamento,
            ciudad,
            fec_creacion,
            contacto, 
            id_user
            } = req.body;

            try{

                let {rowCount} = await dbConnection.query(`SELECT * FROM USUARIO WHERE identificador = $1`, [id_user]);

                console.log (rowCount);

                if(rowCount == 0){
                    return res.status(400).json({
                        ok: false,
                        msg: 'Error en el usuario'
                    });
                }

                //generar unico identificaor delnegocio

                Nid = uniqid('ICN-');
                console.log(Nid);

                //Consulta de insersión a la base de datos.

                await dbConnection.query(`INSERT INTO NEGOCIOS(IDENTIFICADOR, NIT, FORM_JURIDICA, ACT_ECONOMICA, SECT_ECONOMICO, DIRECCION, DEPARTAMENTO, CIUDAD, FECHA_CREACION, CONTACTO, ID_USUARIO, RAZON_SOCIAL)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) `,
                        [Nid, nit, forma_juridica, act_economica,  sect_economico, direccion, departamento, ciudad, fec_creacion, contacto, id_user, razon_social]);

                return res.status(201).json({
                    ok: true,
                    Nid
                });
                
                

            }catch(error){
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error'
                });
            }
}



module.exports = {
    crearBuss
}