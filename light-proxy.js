//simple express app for light switch proxy.
//before usage, copy config.json and edit it for your needs
var express = require('express');
var http = require('http');
var config = require('./config.json');

var app = express();
var switchHost = config.switchIP;

//function to determine the state of the light switch.
//calls the callback upon determining the state with either true or false as parameter
var getStatus = function (callback) { http.get({ host: switchHost, port: '80', path: '/status.xml'}, function(getres) {
        var xmlresponse = '';
          getres.on('data', function (chunk) {
            xmlresponse += chunk;
          });
          getres.on('end', function(){
			callback(( xmlresponse.substr(18,1)=="1" ? true : false ));
          });
    });
};

//http GET for getting the current status of the switch
app.get('/light_status', function(req, res){
    getStatus(function (state) {
		res.json({"light_on": state})
		});
});

//http POST for switching the switch on or off depending on its state
app.post('/switch_light', function(req, res){
    var post = http.request({ host: switchHost, port: '80', path: '/leds.cgi?led=1', method: 'POST'}, function (res) {});
    post.end();
    getStatus(function (state) {
		res.json({"light_on": state})
		});
});

app.listen(3001);