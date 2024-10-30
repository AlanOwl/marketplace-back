const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	login: { type: DataTypes.STRING, unique: true, },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: "USER" },
})

const Basket = sequelize.define('basket', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

})
const OrderProducts = sequelize.define('order_products', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	quantity: { type: DataTypes.INTEGER, allowNull: false },

})
const Order = sequelize.define('order', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	order_date: { type: DataTypes.STRING, allowNull: false },
	delivery_address: { type: DataTypes.STRING, allowNull: false },
	delivery_date: { type: DataTypes.STRING, allowNull: false },
	total_cost: { type: DataTypes.INTEGER, allowNull: false },
	status: { type: DataTypes.STRING, allowNull: false },
})

const BasketProduct = sequelize.define('basket_product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	quantity: { type: DataTypes.INTEGER, allowNull: false },
})

const Product = sequelize.define('product', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true, allowNull: false },
	price: { type: DataTypes.INTEGER, allowNull: false },
	img: { type: DataTypes.STRING, allowNull: false },
	vendor: { type: DataTypes.STRING, allowNull: false },
	description: { type: DataTypes.STRING, allowNull: false },
})



User.hasOne(Basket)
Basket.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)


Order.hasMany(OrderProducts)
OrderProducts.belongsTo(Order)

Product.hasMany(OrderProducts)
OrderProducts.belongsTo(Product)
// Basket.hasMany(Order)
// Order.belongsTo(Basket)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

module.exports = {
	User,
	Basket,
	BasketProduct,
	Product,
	Order,
	OrderProducts
}