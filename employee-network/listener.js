var EmployeeRegistry = require('./employeeRegistry.js')
var records = new EmployeeRegistry();

records.init()
       .then(function(){
            records.getBusinessNetworkConnection().on('event',function(event){
                console.log("employeeEvent received ")
                var temp =  records.getBusinessNetworkConnection().getBusinessNetwork().getSerializer().toJSON(event)
                console.log(temp)
            })
       })