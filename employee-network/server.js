'use strict';

const Hapi = require('hapi');

var EmployeeRegistry = require('./employeeRegistry.js')
// var records = new EmployeeRegistry();
var temp
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    port: 8000 
});

// Add the route
server.route({
    method: 'POST',
    path:'/createLocation', 
    handler: function (request, reply) {
        var temp = request.payload
        var records = new EmployeeRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.addLocation(temp.locationId,temp.city,temp.state)
                    .then(function(response){
                        records.issueIdentity(temp.locationId).then(function(response){
                            records.getBusinessNetworkConnection().disconnect()
                            reply({data:response,status:true})
                        });
                    }).catch(function(error){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })
              
               })
    }
});

server.route({
    method: 'POST',
    path: '/createPerson',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.createEmployee(temp.personId,temp.locationId,temp.info)
                        .then(function(response){
                            records.getBusinessNetworkConnection().disconnect()
                            reply({data:response,status:true})
                        }).catch(function(error){
                            console.log("inside createPerson catch")
                            console.log(error)
                            console.log("inside createPerson catch")
                            records.getBusinessNetworkConnection().disconnect()
                            reply({status:false})
                        })                   
               })

    }
})

server.route({
    method: 'POST',
    path: '/existsLocation',
    handler : function(request,reply){
        var temp = request.payload
         var records = new EmployeeRegistry();
         records.init('admin','adminpw')
               .then(function(response){
                  records.existsLocation(temp.locationId)
                    .then(function(response){
                        reply({status:response})
                        records.getBusinessNetworkConnection().disconnect()
                    }).catch(function(error){
                        records.getBusinessNetworkConnection.disconnect()
                        reply({status:false})
                    })
               })
        
    }
})

server.route({
    method: 'POST',
    path: '/existsPerson',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
         records.init('admin','adminpw')
               .then(function(response){
                    records.existsEmployee(temp.personId)
                                .then(function(response){
                                    records.getBusinessNetworkConnection().disconnect();
                                    reply({status:response})
                                }).catch(function(error){
                                    records.getBusinessNetworkConnection().disconnect();                                    
                                    reply({status:false})
                                })
               })
        
    }
})

server.route({
    method: 'POST',
    path: '/removePerson',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.removeEmployee(temp.personId)
                .then(function(response){
                       records.getBusinessNetworkConnection().disconnect()
                     reply({data:response,status:true})
                }).catch(function(error){
                    records.getBusinessNetworkConnection().disconnect()
                    reply({status:false})
                })
            });
    }              
})

server.route({
    method: 'POST',
    path: '/updateForTransfer',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new EmployeeRegistry();
     records.init(temp.locationId,temp.locationPwd)
               .then(function(response){
                    records.updateForTransfer(temp.personId,temp.locationId)
                        .then(function(response){
                            records.getBusinessNetworkConnection().disconnect()
                            reply({data:response,status:true})
                        }).catch(function(error){
                            records.getBusinessNetworkConnection().disconnect()
                            reply({status:false})
                        })
               })
    }
})

server.route({
    method: 'POST',
    path: '/transferEmployee',
    handler : function(request,reply){
        var temp = request.payload
        // console.log(temp)
        var records = new EmployeeRegistry();
         records.init("admin","adminpw")
               .then(function(response){
                    records.tranferEmployee(temp.personId,temp.locationId,temp.newInfo)
                    .then(function(response){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({data:response,status:true})
                    }).catch(function(error){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })
               })
    }
})
// server.route({
//     method:'POST',
//     path: '/getList',
//     handler: function(request,reply){
//         var temp = request.payload
//         console.log(temp)
//         var records = new EmployeeRegistry();
//         records.init("admin","adminpw")
//                 .then(function(){
//                     console.log(records.getBusinessNetworkConnection().list())
//                     reply({status:true})
//                 }).catch(function(error){
//                     records.getBusinessNetworkConnection().disconnect()
//                     reply({status:false})
//                 })
//     }
// })


server.route({
    method: 'POST',
    path: '/personRegistry',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
         records.init('admin','adminpw')
               .then(function(response){
                   records.listEmployees()
                    .then(function(response){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({data:response,status:true})
                    }).catch(function(error){
                        console.log(error)
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })
               })
        
    }
})

server.route({
    method: 'POST',
    path: '/locationRegistry',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
         records.init('admin','adminpw')
               .then(function(response){
                   records.locationRegistry()
                    .then(function(response){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({data:response,status:true})
                    }).catch(function(error){
                        console.log(error)
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })
               })    }
})
//  records.init('admin','adminpw')
//                .then(function(response){

//                })
server.route({
    method: 'POST',
    path: '/getLocation',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getLocation(temp.locationId)
                .then(function(response){
                    records.getBusinessNetworkConnection().disconnect()
                    reply({data:response,status:true})
                }).catch(function(error){
                    console.log(error)
                    records.getBusinessNetworkConnection().disconnect()
                    reply({status:false})
                })
            })
    }
})

server.route({
    method: 'POST',
    path: '/getPerson',
    handler : function(request,reply){
        var temp = request.payload
        var records = new EmployeeRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getEmployee(temp.personId)
                .then(function(response){
                    records.getBusinessNetworkConnection().disconnect()
                    reply({data:response,status:true})
                }).catch(function(error){
                    console.log(error)
                    records.getBusinessNetworkConnection().disconnect()
                    reply({status:false})
                })
            })
    }
})

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }

    console.log('Server running at:', server.info.uri);
    // records.init()
    //       .then(function(response){
            
    //       });

});