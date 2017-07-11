'use strict';

const Hapi = require('hapi');

var invoiceRegistry = require('./invoice.js')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 8000
});

// Add the route
server.route({
    method: 'POST',
    path:'/createEfforts',
    handler: function (request, reply) {
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.createEffortToken(temp.employeeId, temp.projectId, temp.date, temp.expectedEffort)
                    .then(function(response){
                      records.getBusinessNetworkConnection().disconnect()
                      reply({status:true, data:response})
                    }).catch(function(error){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })

               })
    }
});

server.route({
    method: 'POST',
    path:'/addDay',
    handler: function (request, reply) {
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.addDay(temp.date,temp.projects)
                    .then(function(response){
                      records.getBusinessNetworkConnection().disconnect()
                      reply({status:true, data:response})
                    }).catch(function(error){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })

               })
    }
});

server.route({
    method: 'POST',
    path: '/getEfforts',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getEfforts(temp.effortId)
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
    path: '/getProject',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getProject(temp.projectId)
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
    path: '/submitEfforts',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init(temp.employeeId,temp.employeePassword)
            .then(function(response){
                records.submitEfforts(temp.employeeId,temp.projectId,temp.date,temp.actualEffort)
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
    path: '/getDay',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getDay(temp.date)
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
    path: '/getEmployee',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getEmployee(temp.employeeId)
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
    path:'/addEmployee', 
    handler: function (request, reply) {
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.addEmployee(temp.employeeId,temp.name,temp.location,temp.designation)
                    .then(function(response){
                        records.issueIdentity(temp.employeeId).then(function(response){
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
    path:'/addProject',
    handler: function (request, reply) {
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
               .then(function(response){
                    records.addProject(temp.projectId, temp.name, temp.maxBilling, temp.location,temp.costPerHour,temp.employees)
                    .then(function(response){
                      records.getBusinessNetworkConnection().disconnect()
                      reply({status:true, data:response})
                    }).catch(function(error){
                        records.getBusinessNetworkConnection().disconnect()
                        reply({status:false})
                    })

               })
    }
});
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
