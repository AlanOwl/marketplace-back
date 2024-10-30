const Router = require('express')
const router = new Router()
const controller = require('../controller/controller.js')

router.post('/',controller.createProduct)
router.get('/:id', controller.getProductOne)
router.get('/:sort/:sort2', controller.getProductAll)


module.exports = router