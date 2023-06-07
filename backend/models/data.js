const mongoose=require('mongoose')
const dataSchema = new mongoose.Schema({
    date: Date,
    CO2: Number,
    VOC: Number,
    Temperature: Number,
    Humidity: Number,
    PM2_5: Number,
    PM10: Number,
})

dataSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const DataModel = mongoose.model('Sensor_data', dataSchema)


module.exports = DataModel