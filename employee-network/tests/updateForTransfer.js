var request = require("request");
var accountDetails = require('./account1.json')
var options = { method: 'POST',
  url: 'http://localhost:8000/updateForTransfer',
  headers: 
   { 'postman-token': '287ec259-9744-4b56-33c1-1a46e2b909ea',
     'cache-control': 'no-cache',
     'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
  formData: { personId: 'per444', locationId: accountDetails.data.userID, locationPwd: accountDetails.data.userSecret } };
console.log(accountDetails.data)
request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});