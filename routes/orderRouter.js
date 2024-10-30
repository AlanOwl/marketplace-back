const Router = require('express')
const router = new Router()
const controller = require('../controller/controller.js')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/createOrder', controller.createOrder)
router.get('/getOrders/:userId/:sort1/:sort2', controller.getOrders)
// router.get('/:sort/:sort2', controller.getProductAll)
// router.get('/:id', controller.getProductOne)


module.exports = router