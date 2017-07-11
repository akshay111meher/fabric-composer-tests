var request = require("request");
var fs = require("fs")

var options = { method: 'POST',
  url: 'http://localhost:8000/createPerson',
  headers: 
   { 'postman-token': '5003e860-e65c-5d0c-beea-be4cd0abf927',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: 
   { personId: 'per444',
     locationId: 'loc97',
     info: 'this person is in banglore' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
    console.log(body);

        fs.writeFile("employee.json", body, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        }); 
});
