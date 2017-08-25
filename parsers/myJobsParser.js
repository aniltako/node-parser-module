'use strict';
var cheerio = require("cheerio");
const url = require('url');

var MyJobsParser = function MyJobsParser(){};

MyJobsParser.prototype.parse = function(html){

    var $ = cheerio.load(html);

    var result  = {
        title: '',
        description: '',
        imageUrl: '',
        location: '',
        company: '',
        employmentType: ''
    };

    result.title = getTitle($);

    result.company = getCompany($);

    result.location = getLocation($);

    result.employmentType = getEmployerType($);

    result.imageUrl = getImageUrl($);
    
    result.isMissing = isMissing(result);

    return result;

};

module.exports = MyJobsParser;

var getTitle = ($) => {
    let title = '';

    if( $('[itemprop=title]').first().length > 0 ){	
		return title = $("[itemprop=title]").text();
    }else{
        return title = $('title').first().text().trim();
    }
    return title;
}

var getCompany = ($) => {
    let company = '';
    if ( $('[itemprop=hiringOrganization]').first().length > 0){
			
        if ( $('[itemprop=hiringOrganization]').children('[itemprop=name]').first().length > 0 ){
            
            return company = $('[itemprop=hiringOrganization]').children('[itemprop=name]').text();
        }else{
            
            return company = $('[itemprop=hiringOrganization]').text();
        }
    }
    return company;
}

var getEmployerType = ($) => {
    
    let employmentType = '';
    if ( $("[itemprop=employmentType]").length > 0 ){
        
        return employmentType = $("[itemprop=employmentType]").attr("content");
    }
    return employmentType;
}

var getImageUrl = ($) => {

    let imageUrl = '';

    if ( $('div#direct_companyModule').first().length > 0 ){
			
        if ($('div#direct_companyModule ul#direct_CompanyInfo').first().length > 0 ){
            
            if ( $('div#direct_companyModule ul#direct_CompanyInfo li img').first().length > 0 ){
                
                imageUrl = $('div#direct_companyModule ul#direct_CompanyInfo li img').css('background-image');
                imageUrl = imageUrl.split("'")[1];
                return imageUrl;
            }
        }
        
        if (imageUrl === '' && $('div#direct_companyModule img').first().length > 0 ){

            imageUrl = $('div#direct_companyModule img').attr('src');
            imageUrl = url.resolve('http:', logoUrl);

            return imageUrl;
        }
    }
    return imageUrl;
}

var getLocation = ($) => {

    let location = '';

    if ( $("[itemprop=addressLocality]").first().length > 0 ){
			
        location = $("[itemprop=addressLocality]").text();
        
        if ( $("[itemprop=addressRegion]").first().length > 0 ){
            
            location = location + ", " + $("[itemprop=addressRegion]").text();
        }
        
        if ( $("[itemprop=addressCountry]").first().length > 0 ){
            
            location = location + ", " + $("[itemprop=addressCountry]").attr("content");
        }

        return location;
    }
    return location;
}

var isMissing = (values) => {

    if(!values.title || values.title === '')
        return true;

    if(!values.location || values.location === '')
        return true;

    if(!values.company || values.company === '')
        return true;

    return false;
};