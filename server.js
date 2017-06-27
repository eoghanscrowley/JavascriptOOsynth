var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
	console.log('hello');
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static('public'));

var server = app.listen(3001, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});