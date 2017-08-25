'use strict';
var cheerio = require("cheerio");
const url = require('url');

var CareerArcParser = function CareerArcParser(){};

CareerArcParser.prototype.parse = function(html){

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
            result.location = jobDescriptionObject.jobLocation.address.addressLocality + ', ' + 
                                jobDescriptionObject.jobLocation.address.addressRegion;
        }
        catch(err) {
            console.log("Invalid string format, cannot parse to JSON Object");
        }

    }

    if( result.title === '' && $('div.job-details > p').first().length > 0 ){
        result.title = $('div.job-details > p').first().text().split(/-[0-9]/g)[0];
    }

    if( result.company === '' && $('div.info').first().length > 0 ){
        $('div.info').each(function(i, ele){

            if( $(this).text().indexOf('Company') >= 0 ){
                result.company = $(this).text().split(':')[1];
            }
            if( $(this).text().indexOf('Location') >= 0 ){
                result.location = $(this).text().split(':')[1];
            }
        })
    }

    if ( $('div.job-info > div.logo img').first().length > 0 ){
        result.imageUrl = $('div.job-info > div.logo img').first().attr('src');
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

module.exports = CareerArcParser;