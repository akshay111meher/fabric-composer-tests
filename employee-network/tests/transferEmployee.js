var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:8000/transferEmployee',
  headers: 
   { 'postman-token': '838f4306-f00a-4676-9082-3f1ea3c8052d',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { personId: 'per444',
     locationId: 'loc67',
     newInfo: 'this employee is in hyderabad now' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
