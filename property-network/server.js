'use strict';

const Hapi = require('hapi');

var LandRegistry = require('./landRegistry.js')

var myLand = new LandRegistry();
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
        temp = request.payload
        myLand.addPerson(temp.locationId,temp.city,temp.state)
              .then(function(response){
                  myLand.issueIdentity(temp.locationId).then(function(response){
                      reply({data:response,status:true})
                  });
              }).catch(function(error){
                  reply({status:false})
              })
    }
});

server.route({
    method: 'POST',
    path: '/createPerson',
    handler : function(request,reply){
        temp = request.payload
        myLand.createAsset(temp.personId,temp.locationId,temp.info)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  console.log("inside createPerson catch")
                  console.log(error)
                  console.log("inside createPerson catch")
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/existsLocation',
    handler : function(request,reply){
        temp = request.payload
        myLand.existsPerson(temp.locationId)
              .then(function(response){
                  reply({status:response})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/existsPerson',
    handler : function(request,reply){
        temp = request.payload
        myLand.existsAsset(temp.personId)
              .then(function(response){
                  reply({status:response})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/removePerson',
    handler : function(request,reply){
        temp = request.payload
        myLand.removeAsset(temp.personId)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/updateForTransfer',
    handler : function(request,reply){
        temp = request.payload
        myLand.updateForSale(temp.personId,temp.locationId)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/transferEmployee',
    handler : function(request,reply){
        temp = request.payload
        myLand.tranferProperty(temp.personId,temp.locationId,temp.newInfo)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/personRegistry',
    handler : function(request,reply){
        temp = request.payload
        myLand.listTitles()
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  console.log(error)
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/locationRegistry',
    handler : function(request,reply){
        temp = request.payload
        myLand.personRegistry()
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/getLocation',
    handler : function(request,reply){
        temp = request.payload
        myLand.getPerson(temp.locationId)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})

server.route({
    method: 'POST',
    path: '/getPerson',
    handler : function(request,reply){
        temp = request.payload
        myLand.getAsset(temp.personId)
              .then(function(response){
                  reply({data:response,status:true})
              }).catch(function(error){
                  reply({status:false})
              })
    }
})



// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    myLand.init()
          .then(function(response){
            console.log('Server running at:', server.info.uri);
          })

});