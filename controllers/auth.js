const { response } = require("express");
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {

        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })

    }
}

const googleSignIn = async(req, res = response) => {
    
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify( id_token )
        // const googleUser = await googleVerify( id_token )
        
        let usuario = await Usuario.findOne({ correo })
        
        if ( !usuario ) {
            // Crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            }
            
            usuario = new Usuario( data )
            await usuario.save()
            
        }
        
        // si el usuario en BD
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloquedo'
            })
        }
        
        // Generar el JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

// const googleSignIn = async (req, res = response) => {
//     const { id_token } = req.body;
//     try {
//         const { correo, nombre, img } = await googleVerify(id_token);
//         // console.log(correo, nombre, img)
//         let usuario = await Usuario.findOne({ correo });
//         if (!usuario) {
//             // Tengo que crearlo
//             const data = {
//                 nombre,
//                 correo,
//                 password: ':P',
//                 img,
//                 google: true
//             };
//             console.log('data', data)            
//             usuario = new Usuario(data);
//             console.log('usuario', usuario)
//             await usuario.save();
//         }

//         // Si el usuario en DB
//         if (!usuario.estado) {
//             return res.status(401).json({
//                 msg: 'Hable con el administrador, usuario bloqueado'
//             });
//         }

//         // Generar el JWT
//         const token = await generarJWT(usuario.id);
//         console.log('token', token)
//         res.json({
//             usuario,
//             token
//         });

//     } catch (error) {

//         res.status(400).json({
//             msg: 'Token de Google no es válido'
//         })

//     }

// }

module.exports = {
    login,
    googleSignIn
}