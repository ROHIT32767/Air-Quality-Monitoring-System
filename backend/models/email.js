const mongoose=require('mongoose')
const EmailSchema = new mongoose.Schema({
    date: Date,
    email: String,
    Validated: Boolean,
    Password: String,
    Alt_email: String
})

EmailSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


const EmailModel = mongoose.model('Emails', EmailSchema)


module.exports = EmailModel