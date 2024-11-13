const Items = require('../models/items.models')
const Farms = require('../models/farms.models')
const uploadImage = require('../utils/uploadImage.utils')
const deleteImage = require('../utils/deleteImage.utils')

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

            await existFarm.updateOne({ $push: {items: savedItem._id }})

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
            // return await Items.find().populate('farm')
            return 123;
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

    static getItemByFarm = async ({name}) => {
        try {
            const existFarm = await Farms.findOne({name: name})
            if (!existFarm) {
                return {
                    success: false,
                    message: "Farm don't exist"
                }
            }

            return await Items.find({farm: name})
        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

    static updateItem = async ( id, file, { name, price, type, farm, unitText, unit, description, tag, quantity, procedure, nutrition, preservation }) => {
        try {
            const existItem = await Items.findById(id)
            if (!existItem) {
                return {
                    success: false,
                    message: "Item don't exist"
                }
            }
            if (file){
                // add new image
                const cloudinaryFolder = 'Fudee/Items';
                const Image = await uploadImage(file.path, cloudinaryFolder);
                const data = {
                    image: Image,
                    name,
                    price,
                    type,
                    farm,
                    unitText,
                    unit,
                    description,
                    tag,
                    quantity,
                    procedure,
                    nutrition,
                    preservation
                }
                // delete old image
                const deleteImageUrl = existItem.image
                const linkArr = deleteImageUrl.split('/')
                const imgName = linkArr[linkArr.length - 1]
                const imgID = imgName.split('.')[0]
                const stringImg = 'Fudee/Items/' + imgID
                await deleteImage(stringImg)
                // update new image
                return await Items.findByIdAndUpdate(id, data, {new: true})
            }else{
                const data = {
                    image: existItem.image,
                    name,
                    price,
                    type,
                    farm,
                    unitText,
                    unit,
                    description,
                    tag,
                    quantity,
                    procedure,
                    nutrition,
                    preservation
                }
                // get old image
                return await Items.findByIdAndUpdate(id, data, {new: true})
            }
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