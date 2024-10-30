const Router = require('express')
const router = new Router()
const controller = require('../controller/controller.js')

router.get('/getCart/:basketId', controller.getCart)
router.post('/pushToCart', controller.pushToCart)



module.exports = router