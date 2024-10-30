const uuid = require('uuid')
const path = require('path');
const ApiError = require('../error/ApiError.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Order, OrderProducts, Product, Basket, BasketProduct } = require('../models/models.js');

exports.getOrders = async (req, res, next) => {
	let { userId, sort1, sort2 } = req.params
	userId = Number(userId)
	let sort_arr = [sort1, sort2];
	try {
		const ordersInfo = await Order.findAll({
			order: [[sort_arr]],
			where: { userId },
		});
		let arr = []
		ordersInfo.map((items) => {
			arr.push(items.id)
		})

		let products = []
		for (let i = 0; i < arr.length; i++) {
			orderId = arr[i]
				const orderProducts = await OrderProducts.findAll({
				where: { orderId },
				include:  Product
			});
			let new_arr = []
			orderProducts.map((item) => {
				new_arr.push(item.product)
			})
			let obj = {
				info: ordersInfo[i],
				items: new_arr
			}
			products.push(obj)
		}
		return res.json(products);

	} catch (e) {
		return next(ApiError.badRequest('Какая то ошибка'))
	}

};

exports.createOrder = async (req, res, next) => {
	
	try {
		let { total_cost, userId, basketId, products } = req.body
		console.log(total_cost, userId, basketId, products)
		const order = await Order.create({
			order_date: "01.01.2024",
			delivery_address: "Ryazan",
			delivery_date: "02.02.2024",
			total_cost, userId, basketId, status: true
		});
		for (let index = 0; index < products.length; index++) {
			const order_products = await OrderProducts.create({
				orderId: order.id,
				productId: products[index].productId,
				quantity: products[index].quantity
			})

		}
		BasketProduct.destroy({ where: { basketId }})

		return res.json(order)
	} catch (e) {
		next(ApiError.badRequest(e.message))
	}
};

const generateJwt = (id, login, role) => {
	return jwt.sign(
		{ id, login, role },
		process.env.SECRET_KEY,
		{ expiresIn: '24h' }
	)
}


exports.pushToCart = async (req, res, next) => {
	try {
		let { basketId, productId, sign } = req.body
		const candidate = await BasketProduct.findOne({ where: { productId, basketId } })
		if (candidate) {
			if (sign === '+') { candidate.quantity += 1 }
			else if ((sign === '-')) { candidate.quantity -= 1 }
			await candidate.save();
		} else {
			const data = await BasketProduct.create({ basketId, productId, quantity:1 });
			return res.json(data)
		}


		return res.json(candidate)
	} catch (e) {
		next(ApiError.badRequest(e.message))
	}
};


exports.registration = async (req, res, next) => {
	try {
		const { login, password } = req.body;
		if (!login || !password) {
			return next(ApiError.badRequest('Некорректный login или password'))
		}
		const candidate = await User.findOne({ where: { login } })
		if (candidate) {
			return next(ApiError.badRequest('Пользователь с таким login уже существует'))
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await User.create({ login, password: hashPassword, role: "USER" })
		const basket = await Basket.create({ userId: user.id })
		const token = generateJwt(user.id, user.login, user.role)
		return res.json({ token, user });
	} catch (error) {
		return next(ApiError.badRequest('Какая то ошибка'))
	}
};

exports.login = async (req, res, next) => {
	const { login, password } = req.body
	try {
		const user = await User.findOne({ where: { login } });
		if (!user) {
			return next(ApiError.internal('Пользователь не найден'))
		}
		let comparePassword = bcrypt.compareSync(password, user.password)
		if (!comparePassword) {
			return next(ApiError.internal('Указан неверный пароль'))
		}
		const token = generateJwt(user.id, user.login, user.role)
		return res.json({ token, user })
	} catch (e) {
		return next(ApiError.badRequest('Какая то ошибка login'))
	}
}

exports.auth = async (req, res, next) => {
	const token = generateJwt(req.user.id, req.user.login, req.user.role)
	return res.json({ token })

}
exports.getCart = async (req, res, next) => {


	try {
		let { basketId } = req.params

		const basket = await BasketProduct.findAll({
			where: { basketId },
			include: Product
		})

		return res.json(basket);

	} catch (e) {
		return next(ApiError.badRequest('Какая то ошибка'))
	}

};

exports.getProductAll = async (req, res, next) => {
	let arr = Object.values(req.params);
	try {
		const products = await Product.findAndCountAll({
			order: [[arr]]
		});
		return res.json(products);

	} catch (e) {
		return next(ApiError.badRequest('Какая то ошибка'))
	}

};


exports.getProductOne = async (req, res,next) => {
	let { id } = req.params
	id = Number(id)
	try {
		const product = await Product.findOne({ where: { id } })

		return res.json(product)
	} catch (error) {
		return next(ApiError.badRequest('Какая то ошибка'))
	}
};

exports.createProduct = async (req, res, next) => {
	try {
		let { title, price, vendor, description } = req.body
		const { img } = req.files
		let img2 = img
		let fileName = uuid.v4() + ".jpg"
		img.mv(path.resolve(__dirname, '..', 'static', fileName))
		img2.mv(path.resolve(__dirname, '..', 'static/product', fileName))
		const product = await Product.create({ title, price, vendor, description, img: fileName });

		return res.json(product)
	} catch (e) {
		next(ApiError.badRequest(e.message))
	}
};
