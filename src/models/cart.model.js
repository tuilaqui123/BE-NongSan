const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        items: [
            {
                item: {
                    type: Schema.Types.ObjectId,
                    ref: 'Items',
                },
                amount: {
                    type: Number,
                    required: true,
                },
                price:{
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('cart', CartSchema);