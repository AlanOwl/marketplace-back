const Router = require('express')
const page = new Router()
const controller = require('../controller/controller.js')

page.get('/:id', controller.getProductOne)



module.exports = page