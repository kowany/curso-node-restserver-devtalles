const { response } = require('express')

const usuariosGet = (req, res = response) => {

    const {q, apiKey, limit, page} = req.query
    res.json({
        msg: 'get API - controlador',
        q,
        limit,
        page,
        apiKey
    })
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body

    res.status(201).json( {
        msg: 'post API - controlador',
        nombre,
        edad
    })
}

const usuariosPut = (req, res) => {
    const id = req.params

    res.status(400).json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosPatch = (req, res) => {
    res.status(500).json({
        msg: 'patch API - controlador'
    })
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API - controlador'
    })
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}