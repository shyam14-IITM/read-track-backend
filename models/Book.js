const mongoose= require('mongoose');
const { isUppercase } = require('validator');

const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        uppercase:true,
    },
    author:{type:String,
            uppercase: true
    },
    genre:{type:String},
    completionStatus:{type:Boolean, default:false},
    totalPages:{type:Number},
    pagesRead:{type:Number, default:0},
    rating:{type:Number, min:0, default:0, max: 5},
    remarks:{type:String}
})
module.exports = mongoose.model('Book',bookSchema);