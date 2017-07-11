var request = require("request");

var options = { method: 'POST',
  url: 'http://localhost:8000/getDay',
  headers: 
   { 'postman-token': '41fd8f63-f859-ff4d-8735-370f97b8ef2e',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { date: 'day1' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var d = JSON.parse(body);
  console.log(JSON.stringify(d.data.projects[1],null,2));
});
