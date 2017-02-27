var mongoose = require('mongoose')
var houseSchema = mongoose.Schema({
    'date': Date,
    'count': {
        '江岸区'   : Number,
        '江汉区'   : Number,
        '硚口区'   : Number,
        '汉阳区'   : Number,
        '青山区'   : Number,
        '武昌区'   : Number,
        '洪山区'   : Number,
        '东西湖区'  : Number,
        '东湖高新区' : Number,
        '经济开发区' : Number,
        '江夏区'   : Number,
        '黄陂区'   : Number,
        '蔡甸区'   : Number,
        '新洲区'   : Number,
        '汉南区'   : Number
    }
})
var House = mongoose.model('House', houseSchema)
module.exports = House