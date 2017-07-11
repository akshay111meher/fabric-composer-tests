var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:8000/personRegistry',
  headers: 
   { 'postman-token': '96a5ac9e-5b7c-b0a1-fb70-2120328e47c9',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:8000/locationRegistry',
  headers: 
   { 'postman-token': 'c42d5ad7-3e07-9a25-7d92-839b8a89cd3f',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
