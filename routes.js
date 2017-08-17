var express = require('express');
var router = express.Router();
var Parser = require('./parsers/parser')
var request = require('request');

router.get('/job', function(req, res, next) {
    
    if ( req.query.url !== undefined && req.query.url !== '' ){

        var parser = Parser.forUrl(req.query.url);
        
        request(req.query.url, function(error, response, html){
            var values = parser.parse(html);
            res.send(values);
        });
    }
});

module.exports = router;
