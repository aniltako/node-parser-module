'use strict';
var cheerio = require("cheerio");
const url = require('url');

var StartupHireParser = function StartupHireParser(){};

StartupHireParser.prototype.parse = function(html){

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

    if ( $('[itemprop=jobLocation]').first().length > 0 ){
        result.location = $('[itemprop=jobLocation]').first().text();
    }

    console.log($('td').text(), "POSTED DATE")

    if ( $('[itemprop=datePosted]').first().length > 0 ){
        result.postedDate = $('[itemprop=datePosted]').first().text();
    }

    if ( $('[itemprop=employmentType]').first().length > 0 ){
        result.employmentType = $('[itemprop=employmentType]').first().text();
    }

    if ( $('div.companyLogo > a > img').first().length > 0 ){
        result.imageUrl = $('div.companyLogo > a > img').first().attr('src');

        if ( !result.imageUrl.indexOf('http') >= 0) {
            result.imageUrl = url.resolve('http://www.startuphire.com', result.imageUrl);
        }

    }

    result.isMissing = isMissing(result);

    return result;

};

module.exports = StartupHireParser;


var isMissing = (values) => {

    if(!values.title || values.title === '')
        return true;

    if(!values.location || values.location === '')
        return true;

    if(!values.company || values.company === '')
        return true;

    return false;
};