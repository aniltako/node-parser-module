'use strict';
var cheerio = require("cheerio");
const url = require('url');

var StackOverFlowParser = function StackOverFlowParser(){};

StackOverFlowParser.prototype.parse = function(html){

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

        let jobDescriptionObject =  JSON.parse(jobDescription);

        result.title = jobDescriptionObject.title;
        result.company = jobDescriptionObject.hiringOrganization.name;
        result.postedDate = jobDescriptionObject.datePosted;
        result.employmentType = jobDescriptionObject.employmentType;
    }
		
    if( $('.-description .-salary').first().length > 0 ){

        let salary = $('.-description .-salary').first().text();
        result.salary = salary;	
    }

    if( $('.-description .-company .-location').first().length > 0 ){
        
        let location = $('.-description .-company .-location').first().text();
        result.location = location.split('-')[1];	
    }

    if ( $('.detail-company-logo img').first().length > 0 ){

        let imageUrl = $('.detail-company-logo img').first().attr('src');

        if ( imageUrl.indexOf('https') >= 0) {
            result.imageUrl = imageUrl;
        }else {
            result.imageUrl = url.resolve('https:', imageUrl);
        }
    }

    result.isMissing = isMissing(result);

    return result;

};

module.exports = StackOverFlowParser;


var isMissing = (values) => {

    if(!values.title || values.title === '')
        return true;

    if(!values.location || values.location === '')
        return true;

    if(!values.company || values.company === '')
        return true;

    return false;
};