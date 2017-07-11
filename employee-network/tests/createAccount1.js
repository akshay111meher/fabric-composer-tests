var request = require("request");
var fs = require("fs")
var options = { method: 'POST',
  url: 'http://localhost:8000/createLocation',
  headers: 
   { 'postman-token': '7215ab96-1ea2-5d29-c922-e08b058c4c12',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { locationId: 'loc97', city: 'banglore', state: 'karntaka' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(body);

        fs.writeFile("account1.json", body, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        }); 
});
