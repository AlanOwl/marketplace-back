const Router = require('express')
const router = new Router()

const productRouter = require('./productRouter')
const userRouter = require('./userRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const one = require('./oneProduct')


router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)


module.exports = router