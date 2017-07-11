var LandRegistry = require('./employeeRegistry.js')

var myLand = new LandRegistry();

// myLand.init()
//        .then(function(response){
//         myLand._bootstrapTitles()
//               .then(function(response){
//                 myLand.listTitles()
//               })
//               .catch(function(error){
//                   console.log(error)
//               })
//        }).catch(function(error){
//            console.log(error)
//        })

myLand.init('admin','adminpw')
       .then(function(response){
            var securityContext = myLand.bizNetworkConnection.securityContext.user
            console.log(securityContext)
            myLand.getBusinessNetworkConnection().getAllAssetRegistries(securityContext)
                                               .then(function(response){
                                                   console.log(response)
                                                   myLand.getBusinessNetworkConnection().disconnect();
                                               })
            // myLand.listTitles()
            //       .then(function(response){
            //           console.log(response)
            //       })
            // myLand.personRegistry()
            //       .then(function(result){
            //         console.log(result)
            //       })
            // myLand._bootstrapTitles()
            //       .then(function(response){
            //           console.log(response)
            //       })
            // myLand.addPerson('40',"agra",'up')
            //       .then(function(response){
            //             myLand.issueIdentity('40').then(function(response){
            //                 console.log(response)
            //             })
                        
            //       }).catch(function(error){
            //           console.log(error)
            //       })
            // myLand.addPerson('41',"banglore",'karnataka')
            //       .then(function(response){
            //             myLand.issueIdentity('41').then(function(response){
            //                 console.log(response)
            //             })
                        
            //       }).catch(function(error){
            //           console.log(error)
            //       })    
            // myLand.updateForSale('30','40')
            //       .then(function(response){
            //             console.log(response)
            //       })
            // myLand.existsAsset("1").then(function(response){
            //       console.log(response)
            // })
            // myLand.createAsset('30','40','ayush is in agra')
            //       .then(function(response){
            //             console.log(response)
            //       })
            // myLand.createAsset('6666','324333','This is prateek house')
            //       .then(function(response){
            //             console.log(response)
            //       })
            // myLand.createAsset('7777','324333','This is prateek second house')
            //       .then(function(response){
            //             console.log(response)
            //       })
            // myLand.createAsset('8888','324333','This is prateek second house')
            //       .then(function(response){
            //             console.log(response)
            //       })
            // myLand.tranferProperty('30','41','ayush came from agra to banglore').then(function(response){
            //       console.log(response)
            // })
            // myLand.removeAsset('8888').then(function(response){
            //       console.log(response)
            // })
            // myLand.existsPerson("324228").then(function(response){
            //       console.log(response)
            // })
            // myLand.getAsset('30').then(function(response){
            //       console.log(response)
            // })
            // myLand.getPerson('40').then(function(response){
            //       console.log(response)
            // })
       })
       .catch(function(error){
           console.log(error)
       })



