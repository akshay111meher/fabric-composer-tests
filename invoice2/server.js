'use strict';

const Hapi = require('hapi');

var invoiceRegistry = require('./invoice.js')

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 8000
});

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
    path: '/addProject',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.addProject(temp.projectId,temp.name,temp.date,temp.previous,temp.startDate,temp.endDate,temp.location,temp.onshore,temp.offshore)
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
//this will link employee to a particular project
server.route({
    method: 'POST',
    path: '/linkEmployee',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.linkEmployee(temp.day,temp.employeeId,temp.projectId)
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
    path: '/addEffortData',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.addEffortData(temp.day,temp.projectId,temp.employeeId)
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
    path: '/addEffortToken',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init(temp.employeeId,temp.userSecret)
            .then(function(response){
                records.submitEffort(temp.projectId,temp.employeeId,temp.from,temp.to,temp.day)
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
    path: '/addDay',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.addDay(temp.date)
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
});

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
    path: '/getEffortData',
    handler : function(request,reply){
        var temp = request.payload
        console.log(temp)
        var records = new invoiceRegistry();
        records.init('admin','adminpw')
            .then(function(response){
                records.getEffortData(temp.date,temp.employeeId)
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
