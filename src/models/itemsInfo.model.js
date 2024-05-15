const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemsInfoSchema = new Schema(
    {
        procedure: [String],
        nutrition: [String],
        preservation: [String]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ItemsInfo', ItemsInfoSchema);