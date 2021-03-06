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
        employmentType: '',
        salary: '',
        postedDate: ''
    };

    if( $('script[type="application/ld+json"]').first().length > 0 ){

        let jobDescription = $('script[type="application/ld+json"]').first().html().toString();

        let validJobObject = jobDescription.replace(/\n/g, '');

        try {

            let jobDescriptionObject =  JSON.parse(validJobObject);

            result.title = jobDescriptionObject.title;
            result.company = jobDescriptionObject.hiringOrganization.name;
            result.postedDate = jobDescriptionObject.datePosted;
            result.employmentType = jobDescriptionObject.employmentType;

        }catch(err){
            console.log("Invalid string format, cannot parse to JSON Object");
        }

    }

    if ( result.title === '' && $('title').first().length > 0 ){

        var titleAndCompany = $('title').first().text().trim();

        result.title = titleAndCompany.split("-")[0];

        result.company = titleAndCompany.split("-")[1];
    }


    if ( $("li[title=Location]").first().length > 0 ){
        result.location = $("li[title=Location]").text();
    }


    if ( $('div.brand-logo a img').first().length > 0 ){

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