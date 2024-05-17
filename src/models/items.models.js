const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema(
    {
        image: String,
        name: String,
        price: Number,
        unitText: String,
        unit: String,
        description: String,
        tag: Number,
        quatity: Number,
        procedure: String,
        nutrition: String,
        preservation: String,
        purchases: Number,
        farm: {
            type: Schema.Types.ObjectId,
            ref: 'Farms',
        },
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Types',
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comments',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Items', ItemsSchema);