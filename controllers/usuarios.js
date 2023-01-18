const { response } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario  = require('../models/usuario')



const usuariosGet = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }
    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite))

    // const total = await Usuario.countDocuments(query)

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async(req, res) => {

    const { nombre, correo, password, rol } = req.body

    const usuario = new Usuario( { nombre, correo, password, rol } )
    
    // verificar si el correo ya existe

    // encriptar la contraseña
    const salt = bcryptjs.genSaltSync(10)
    usuario.password = bcryptjs.hashSync(password, salt)
    
    // Guardar en BD
    await usuario.save()
    res.status(201).json( {
        usuario
    })
}

const usuariosPut = async(req, res) => {
    const { id } = req.params
    const { _id, password, google, correo, ...resto } = req.body
    
    if ( password ) {
        const salt = bcryptjs.genSaltSync(10)
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)
    res.json(usuario)
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params

    // Borrar físicamente
    // const usuario = await Usuario.findByIdAndDelete(id)

    // Cambiando el estado, equivale a borrarlo de manera lógica
    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } )

    res.json({
        usuario
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}