const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('gettingstarted');


let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
const LOG = winston.loggers.get('application');


class EmployeeRegistry {
     
        constructor() {

        this.bizNetworkConnection = new BusinessNetworkConnection();
        this.CONNECTION_PROFILE_NAME = config.get('connectionProfile');
        this.businessNetworkIdentifier = config.get('businessNetworkIdentifier');
        console.log(this.CONNECTION_PROFILE_NAME,this.businessNetworkIdentifier,participantId,participantPwd)

        // this.bizNetworkConnection.on('EmployeeEvent', (event) => {
        //    console.log('employee event received', event);
        // });
    }
    getBusinessNetworkConnection(){
        return this.bizNetworkConnection;
    }
    
    /** @description Initalizes the EmployeeRegistry by making a connection to the Composer runtime
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
    init(user,secret) {      
        return this.bizNetworkConnection.connect(this.CONNECTION_PROFILE_NAME, this.businessNetworkIdentifier, user,secret)
            .then((result) => {
                this.businessNetworkDefinition = result;
                LOG.info('EmployeeRegistry:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
            })
                // and catch any exceptions that are triggered
            .catch(function (error) {
                throw error;
            });
      
    }

    updateForTransfer(id,owner) {
        const METHOD = 'updateForTransfer';

        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get('EmployeeID'+id);

      }).then((result) => {

	      let factory  = this.businessNetworkDefinition.getFactory();
        //   console.log(factory)
	      let transaction    = factory.newTransaction('net.biz.digitalEmployeeNetwork','RegisterEmployeeForTransfer');		
		  transaction.employee  = factory.newRelationship('net.biz.digitalEmployeeNetwork', 'Employee', "EmployeeID"+id);
		  transaction.from = factory.newRelationship('net.biz.digitalEmployeeNetwork', 'Location', owner); 	
        //   console.log(transaction)

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      }) 
      .catch(function (error) {
          LOG.error('EmployeeRegistry:updateForTransfer', error);
          throw error;
      });
    }

    locationRegistry() {
        let locationRegistry;
        LOG.info('EmployeeRegistry:locationRegistry', 'getting location registry for "net.biz.digitalEmployeeNetwork.Location"');
       
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalEmployeeNetwork.Location')
        .then((registry) => {
            locationRegistry = registry
          return locationRegistry.resolveAll()
      })
    }

    issueIdentity(locationId) {
        return this.bizNetworkConnection.issueIdentity('net.biz.digitalEmployeeNetwork.Location#LocationID'+locationId, 'LocationID'+locationId)
    }
    
    addLocation(locationId,city,state){
        let location
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('EmployeeRegistry:_bootstrapTitles', 'Creating a location');
        location = factory.newResource('net.biz.digitalEmployeeNetwork', 'Location', 'LocationID'+locationId);
        location.city = city;
        location.state = state;

        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalEmployeeNetwork.Location')
                                        .then((locationRegistry) => {
                                            return locationRegistry.add(location);
                                        }) // and catch any exceptions that are triggered
                                        .catch(function (error) {
                                            console.log(error);
                                            LOG.error('EmployeeRegsitry:addLocation', error);
                                            throw error;
                                        });
    }
    existsEmployee(id){
        let employeeRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')
                   .then((registry)=>{
                       employeeRegistry = registry
                       return employeeRegistry.exists('EmployeeID'+id)
                   })
    }
    
    existsLocation(id){
        let locationRegistry
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalLocationRegistry.Location')
                   .then((registry)=>{
                       locationRegistry = registry
                       return locationRegistry.exists('LocationID'+id)
                   })
    }

    tranferEmployee(id,newLocation,newInfo){
        let employeeRegistry
        let info
        let employee1
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')    
                   .then((registry)=>{
                       employeeRegistry = registry
                    //    console.log("you are in first promise")
                       return employeeRegistry.get('EmployeeID'+id)
                   }).then((resource)=>{
                    //    console.log("you are in second promise")
                        console.log(resource.employeeId,resource.information)
                        info = resource.information
                        let factory = this.businessNetworkDefinition.getFactory();
                        if(resource.forTransfer){
                            // console.log("you are in third case..if else condition")
                                let factory = this.businessNetworkDefinition.getFactory();
                                let locationRelation = factory.newRelationship('net.biz.digitalEmployeeNetwork', 'Location', 'LocationID'+newLocation);
        
                                LOG.info('EmployeeRegistry:transferProperty', 'Transfering land title#'+id);
                                let employee1 = factory.newInstance('net.biz.digitalEmployeeNetwork', 'Employee', 'EmployeeID'+id);
                                employee1.current = locationRelation;
                                employee1.information = newInfo;
                                // console.log(landTitle1)
                                return employeeRegistry.update(employee1)
                        }else{
                            throw Error("resource is not for sale")
                        }
                        // createAsset(id,newOwner,info)
                   })
                   .catch((error)=>{
                        console.log(error)
                   })
    }
    createEmployee(id,locationId,info){
        
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')
                    .then((result)=>{
                        this.employeeRegistry = result;
                    }).then(()=>{
                        LOG.info('EmployeeRegistry:createEmployee', 'getting factory and adding employees');
                        let factory = this.businessNetworkDefinition.getFactory();


                        let locationRelation = factory.newRelationship('net.biz.digitalEmployeeNetwork', 'Location', 'LocationID'+locationId);
                        
                        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a employee#'+id);
                        let employee1 = factory.newInstance('net.biz.digitalEmployeeNetwork', 'Employee', 'EmployeeID'+id);
                        employee1.current = locationRelation;
                        employee1.information = info;

                        LOG.info('EmployeeRegistry:createEmployee', 'Adding these to the registry');
                        return this.employeeRegistry.addAll([employee1]);
                    }).catch(function (error) {
                        console.log(error);
                        LOG.error('EmployeeRegsitry:createEmployee', error);
                        throw error;
                    });

    }

    getEmployee(id){
        let employeeRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')
                    .then((result)=>{
                        employeeRegistry = result;
                    }).then(()=>{
                       return employeeRegistry.resolve('EmployeeID'+id)
                   }).then((result)=>{
                       let location = {
                           LocationID: result.current.locationId,
                           city: result.current.city,
                           state: result.current.state
                       }
                        return {PersonID:result.employeeId,information:result.information,location:location}
                   })
    }
     
    getLocation(id){
        let locationRegistry
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalEmployeeNetwork.Location')
        .then((registry) => {
            locationRegistry = registry
      }).then(()=>{
          return locationRegistry.resolve('LocationID'+id)
      }).then((location)=>{
            return ({LocationID:location.locationId,city:location.city,state:location.state})
      })
    }

    removeEmployee(id){
        let employeeRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')    
                   .then((registry)=>{
                       employeeRegistry = registry
                       return employeeRegistry.get('PersonID'+id)
                    }).then((resource)=>{
                        return employeeRegistry.remove(resource)
                    })
                
    }

    listEmployees() {

        const METHOD = 'listEmployees';

        let employeeRegistry;
        let locationRegistry;

        LOG.info(METHOD, 'Getting the asset registry');
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee')
        .then((registry) => {
          employeeRegistry = registry;

          return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalEmployeeNetwork.Location');
        }).then((registry)  => {
          locationRegistry = registry;

          LOG.info(METHOD, 'Getting all employees from the registry.');
          return employeeRegistry.resolveAll();

        })

    .then((aResources) => {
        return(aResources);
    })
    .catch(function (error) {
        console.log(error);
        this.log.error(METHOD, 'uh-oh', error);
    });

    }
}
module.exports = EmployeeRegistry;