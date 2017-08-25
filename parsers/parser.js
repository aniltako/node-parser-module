'use strict';
var GenericParser = require('./genericParser')
var ATSJazzParser = require('./atsJazzParser')
var MyJobsParser = require('./myJobsParser')
var StackOverFlowParser = require('./stackOverFlowParser');
var DiceParser = require('./diceParser')
var CareerArcParser = require('./careerArcParser')
var StartupHireParser = require('./startuphireParser')

var Parser = function(){

    var forUrl = module.exports.forUrl = function (url)
    {
        if ( url.indexOf('rga.applytojob.com') >= 0 || 
            url.indexOf('yesware.applytojob.com') >= 0 ||
            url.indexOf('mashable.theresumator.com') >= 0
        ){

            return Object.create(ATSJazzParser.prototype);
            
        }else if ( url.indexOf('my.jobs') >= 0 ){

            return Object.create(MyJobsParser.prototype);
        }else if ( url.indexOf('stackoverflow.com') >= 0 ){
            return Object.create(StackOverFlowParser.prototype);
        }else if ( url.indexOf('dice.com') >= 0 ){
            return Object.create(DiceParser.prototype);
        }else if ( url.indexOf('careerarc.com') >= 0 ){
            return Object.create(CareerArcParser.prototype);
        }else if ( url.indexOf('startuphire.com') >= 0 ){
            return Object.create(StartupHireParser.prototype);
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