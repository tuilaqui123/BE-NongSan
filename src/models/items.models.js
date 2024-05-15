const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsSchema = new Schema(
    {
        name: String,
        price: Number,
        image: String,
        unitText: String,
        unit: String,
        description: String,
        tag: Number,
        quatity: Number,
        purchases: Number,
        farm: {
            type: Schema.Types.ObjectId,
            ref: 'Farms',
        },
        type: {
            type: Schema.Types.ObjectId,
            ref: 'Types',
        },
        itemsInfo: {
            procedure: [String],
            nutrition: [String],
            preservation: [String],
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