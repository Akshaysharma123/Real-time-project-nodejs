const Order = require('../../../models/order')
const moment = require('moment')

function orderController() {
    return {
        store(req, res) {
        //  validate request
            const {number, address} = req.body
            
            if (!number || !address) {
                req.flash('error', 'All field are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                number,
                address 
            })

            order.save().then(result => {
                
                req.flash('success', 'Order Placed Successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            
            }).catch(err => {
            
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            
            })
        },

        async customerOrders(req, res) {
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } })
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            res.render('customers/orders', {orders: orders, moment: moment})
            // console.log(orders)
        }

    }
}

module.exports = orderController