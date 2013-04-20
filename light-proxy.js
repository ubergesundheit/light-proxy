//simple express app for light switch proxy.
//before usage, copy config.json and edit it for your needs
var express = require('express');
var http = require('http');
var config = require('./config.json');

var app = express();
app.use(express.basicAuth(config.username, config.password));


//http POST for switching the switch on or off depending on its state
app.post('/switch_light/:no', function(req, res){
    var post = http.request(
		{ host: config.switchIP,
		  port: '80',
		  path: '/leds.cgi?led='+req.params.no,
		  method: 'POST',
		  headers:
			{'Authorization': 'Basic ' + new Buffer(config.username + ':' + config.password).toString('base64')}
		}, function (res) {});
    post.end();
	res.send(200);
});

app.listen(3001);
