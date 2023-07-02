const http = require('http');
const express = require('express');
var request = require('request');


const app = express();


let options = {
  'method': 'POST',
  'url': 'https://demo.school.kiwi/api/api.php',
  'headers': {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'KAMAR API Demo',
    'Origin': 'file://',
    'X-Requested-With': 'nz.co.KAMAR'
  },

};

request(options, (error, response, body) => {
  if (error) console.log(error)
  console.log(body);
});


app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});


const port = 3000;
const server = http.createServer(app);
server.listen(port);