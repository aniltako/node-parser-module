'use strict';
var cheerio = require("cheerio");
const url = require('url');

var ATSJazzParser = function ATSJazzParser(){};

ATSJazzParser.prototype.parse = function(html){

    var $ = cheerio.load(html);

    var result  = {
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        company: '',
        employmentType: ''
    };


    if ( $('title').first() !== null){

        var titleAndCompany = $('title').first().text().trim();

        result.title = titleAndCompany.split("-")[0];

        result.company = titleAndCompany.split("-")[1].trim();
    }


    if (  $("li[title=Location]").first() ){
        result.location = $("li[title=Location]").text().trim();
    }


    if ( $('div.brand-logo a img').first() != null ){

        let logoUrl = $('div.brand-logo a img').attr('src');
        
        result.imageUrl = url.resolve('http:', logoUrl);

    }

    var isMissing = function (values) {

        if(!values.title || values.title === '')
            return true;

        if(!values.location || values.location === '')
            return true;

        if(!values.company || values.company === '')
            return true;

        return false;
    };
    
    result.isMissing = isMissing(result);

    return result;

};

module.exports = ATSJazzParser;