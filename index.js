var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

console.log('✅ App running at http://localhost:8080');
