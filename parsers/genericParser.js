'use strict';
var cheerio = require("cheerio");
var microdata = require('microdata-node');
var _ = require('lodash');

var GenericParser = function GenericParser() {};

GenericParser.prototype.parse = function (html, skipCheerio) {

    if (!skipCheerio) {
        var $ = cheerio.load(html);
    }

    var json = microdata.toJsonld(html);

    var getValue = function (json, schema) {

        var value;
        for (var i = 0; i < json.length; i++) {
            var item = json[i];
            if (item && item[schema]) {

                if (_.isArray(item[schema])) {
                    var head = _.head(item[schema]);
                    if (head && head["@value"]) {
                        value = head["@value"].trim();
                        break;
                    }
                } else {
                    value = item[schema].trim();
                    break;
                }
            }
        }

        return value;

    };

    var getJobTitle = function () {


        var value = getValue(json, "http://schema.org/title");
        if (value)
        {
            return value;
        }

        if (!skipCheerio) {
            return $('title').text().trim();
        }
    };

    var getLocation = function () {

        return getValue(json, "http://schema.org/jobLocation") || getValue(json, "http://schema.org/addressLocality");

    };

    var getCompanyName = function () {

        return getValue(json, "http://schema.org/name") || getValue(json, "https://schema.org/name");

    };

    var getEmpType = function () {

        return getValue(json, "http://schema.org/employmentType");
    };


    var getCompanyLogo = function () {
    };

    var isMissing = function (values) {

        if (!values.title || values.title === '')
            return true;

        return false;
    };


    var result = {
        title: getJobTitle(),
        description: "",
        imageUrl: getCompanyLogo(),
        location: getLocation(),
        company: getCompanyName(),
        employmentType: getEmpType()
    };

    result.isMissing = isMissing(result);

    return result;
};

module.exports = GenericParser;