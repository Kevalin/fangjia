var cheerio = require('cheerio')
var request = require('superagent')
var charset = require('superagent-charset'); charset(request)
var async = require('async')
var util = require('util')
var moment = require('moment')
var _ = require('lodash')
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/house')
var House = require('./model/house')

var url = 'http://scxx.whfcj.gov.cn/scxxbackstage/whfcj/contents/854/'
var urlList = []
for (var i = 21890; i < 24238; i ++) {
    urlList.push(url + i + '.html')
}

async.eachSeries(urlList, function(url, cb) {
    request.get(url)
    .charset('gbk')
    .end(function(err, res) {
        if (err) {
            if (err.status === 404 || err.code === 'ETIMEDOUT') {
                cb(null); return
            }
            cb(err); return
        }

        var $ = cheerio.load(res.text)
        var bigTable = $('table[width="90%"][align="center"]')
        var date = getDate(bigTable.find('.newstitle').text())
        if (!date) {
            cb(null); return
        }

        var house = {
            date: date,
            count: {}
        }
        var smallTable = bigTable.children('tr').eq(2).find('table')
        smallTable.find('tr').each(function(index) {
            if (index > 1 && index < 17) {
                house.count[$(this).children('td').eq(0).text()] = parseInt($(this).find('td').eq(1).text(), 10)
            }
        })

        if (_.isEmpty(house.count)) {
            cb(null); return
        }
        
        var _house = new House(house)
        _house.save(function(err) {
            if (err) {
                cb(err); return
            }
            util.log('bugs save success', house.date)
            cb(null)
        })
    })
}, function(err) {
    if (err) {
        util.log('bugs error', err)
    }
    util.log('bugs complete')
    process.exit()
})

function getDate(str) {
    var array = str.split('')
    var date = moment(array.slice(0, array.indexOf('日')).join('').replace('年', '-').replace('月', '-'), 'YYYY-MM-DD', 'fr').isValid()
    if (date) {
        return moment(array.slice(0, array.indexOf('日')).join('').replace('年', '-').replace('月', '-'), 'YYYY-MM-DD', 'fr')
    }
    return false
}