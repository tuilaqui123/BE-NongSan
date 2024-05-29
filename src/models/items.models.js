const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema(
    {
        image: String,
        name: String,
        type: String,
        farm: {
            type: Schema.Types.ObjectId,
            ref: 'Farms',
        },
        price: Number,
        unitText: String,
        unit: String,
        description: String,
        tag: Number,
        quantity: Number,
        procedure: String,
        nutrition: String,
        preservation: String,
        purchases: Number
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Items', ItemsSchema);