const Orders = require('../models/orders.model')
const Vouchers = require('../models/vouchers.model')
const Items = require('../models/items.models')
const getData = require('../utils/formatRes')
const _ = require('lodash');
class OrdersServices {
    
    static addOrder = async ({ deliveryFee, items, customer, voucher, method }) => {
        // method is bank and cast
        try {
            // check exist voucher
            const existVoucher = await Vouchers.findById(voucher)
            
            // check exist list item
            const results = await Promise.all(
                items.map(async (ele) => {
                    const existItem = await Items.findById(ele.item);
                    return !!existItem;
                })
            );
            
            const allExistItem = results.every(exist => exist);
            
            if (!allExistItem) {
                return {
                    success: false,
                    message: "One or more items don't exist",
                };
            }

            const checkPaymentStatus = method === "cast" ? "Chua thanh toan" : "Da thanh toan"

            var firstPrice = items.reduce((total, item) => {
                return total + (item.amount * item.price);
            }, 0);

            if (existVoucher){
                var totalPrice = (firstPrice*existVoucher.percent)/100; 
            }

            totalPrice = totalPrice + deliveryFee;

            const newOrder = new Orders({
                total: totalPrice,
                intoMoney: firstPrice,
                deliveryStatus: "Dang van chuyen",
                paymentStatus: checkPaymentStatus,
                deliveryFee,
                items: items,
                customer,
                voucher
            })

            const savedOrder = newOrder.save()

            return (await (await savedOrder).populate('voucher')).populate('items.item')
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndUpdate({ id }, { total, intoMoney, date, deliveryStatus, paymentStatus })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteOrder = async ({ id }) => {
        try {
            return await Orders.findByIdAndDelete(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrder = async () => {
        try {
            const orders = await Orders.find({})
                        .populate("voucher").populate('items.item')
            return orders;
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getOrderID = async ({ id }) => {
        try {
            const existOrder = await Orders.findById(id);
            if (!existOrder){
                return {
                    success: false,
                    message: "Don't exist"
                }
            }
            
            return (await existOrder.populate('voucher')).populate('items.item');
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = OrdersServices