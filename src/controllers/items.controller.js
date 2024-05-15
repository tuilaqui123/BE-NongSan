const Items = require("../models/items.models")

// [GET] api/product
const read = async (req, res, next) => {
    try {
        const items = await Items.find()
            .populate('Farm')
            .populate('Types')
            .populate('Comments');
        return res.status(200).json({ success: true, itemss });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, status: 500, message: 'Internal server error' });
    }
};
