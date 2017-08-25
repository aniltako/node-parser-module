'use strict';
var cheerio = require("cheerio");
const url = require('url');

var DiceParser = function DiceParser(){};

DiceParser.prototype.parse = function(html){

    var $ = cheerio.load(html);

    var result  = {
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        company: '',
        employmentType: '',
        salary: '',
        postedDate: ''

    };

    if ( $('[itemprop=title]').first().length > 0 ){
        result.title = $('[itemprop=title]').first().text();
    }else {
        result.title = $('title').first().text();
    }

    if ( $('[itemprop=hiringOrganization]').first().length > 0 ){
        result.company = $('[itemprop=hiringOrganization]').first().text();
    }

    if ( $('[itemprop=joblocation]').first().length > 0 ){
        result.location = $('[itemprop=joblocation]').first().text();
    }

    if ( $('[itemprop=datePosted]').first().length > 0 ){
        result.postedDate = $('[itemprop=datePosted]').first().attr('content');
    }

    if ( $('[itemprop=employmentType]').first().length > 0 ){
        result.employmentType = $('[itemprop=employmentType]').first().attr('content');
    }

    if ( $('[itemprop=baseSalary]').first().length > 0 ){
        result.salary = $('[itemprop=baseSalary]').first().text();
    }
			
    if ( $('img.h-logo').first().length > 0 ){
        result.imageUrl = $('img.h-logo').attr('src');
    }else if ( $('div.brcslb-img img').first().length > 0 ){
        result.imageUrl = $('div.brcslb-img img').first().attr('src');
    }

    //make url absolute
    if( result.imageUrl !== '' && !result.imageUrl.indexOf('https') >= 0) {
        result.imageUrl = url.resolve('https:', result.imageUrl);
    }

    result.isMissing = isMissing(result);

    return result;

};

module.exports = DiceParser;


var isMissing = (values) => {

    if(!values.title || values.title === '')
        return true;

    if(!values.location || values.location === '')
        return true;

    if(!values.company || values.company === '')
        return true;

    return false;
};