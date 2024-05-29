const Items = require('../models/items.models')
const Farms = require('../models/farms.models')
const uploadImage = require('../utils/uploadImage.utils')

class ItemsService {
    static addItem = async (image, { name, price, type, farm, unitText, unit, description, tag, quantity, procedure, nutrition, preservation }) => {
        try {
            const isExist = await Items.findOne({ name }).lean();
            if (isExist) {
                return {
                    success: false,
                    message: "Already exist"
                }
            }

            const existFarm = await Farms.findOne({ name: farm });
            if (!existFarm) {
                return {
                    success: false,
                    message: "Farm don't exist"
                }
            }

            const cloudinaryFolder = 'Fudee/Items';
            const Image = await uploadImage(image, cloudinaryFolder);

            const newItem = new Items({
                image: Image, name, price, type, farm, unitText, unit, description, tag, quantity, procedure, nutrition, preservation
            })

            const savedItem = await newItem.save()

            await existFarm.updateOne({ $push: {items: savedItem._id}})

            return savedItem
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getItem = async () => {
        try {
            return await Items.find().populate('farm')
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static getItemID = async ({ id }) => {
        try {
            return await Items.findById(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateItem = async ({ id }, { name, price, type, farm, unitText, unit, description, tag, quantity, procedure, nutrition, preservation }) => {
        try {
            return await Items.findByIdAndUpdate(id, { name, price, type, farm, unitText, unit, description, tag, quantity, procedure, nutrition, preservation })
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static deleteItem = async ({ id }) => {
        try {
            return await Items.findByIdAndDelete(id)
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }
}

module.exports = ItemsService