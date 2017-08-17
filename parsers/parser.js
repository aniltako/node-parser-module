'use strict';
var GenericParser = require('./genericParser')
var ATSJazzParser = require("./atsJazzParser")

var Parser = function(){

    var forUrl = module.exports.forUrl = function (url)
    {
        if ( url.indexOf('rga.applytojob.com') >= 0 || 
            url.indexOf('yesware.applytojob.com') >= 0 ||
            url.indexOf('mashable.theresumator.com') >= 0
        ){

            return Object.create(ATSJazzParser.prototype);
        }
        else {
            return Object.create(GenericParser.prototype);
        }
    };

    return {
        forUrl: forUrl
    };
};

module.exports = Parser();