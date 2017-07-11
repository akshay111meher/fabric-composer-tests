const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('gettingstarted');


let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
const LOG = winston.loggers.get('application');


class Invoice {
     
    constructor() {

        this.bizNetworkConnection = new BusinessNetworkConnection();
        this.CONNECTION_PROFILE_NAME = config.get('connectionProfile');
        this.businessNetworkIdentifier = config.get('businessNetworkIdentifier');
        console.log(this.CONNECTION_PROFILE_NAME,this.businessNetworkIdentifier,participantId,participantPwd);

        this.bizNetworkConnection.on('EmployeeEvent', (event) => {
           console.log('employee event received', event);
        });
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

    getProject(id){
        let projectRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Project')
                    .then((result)=>{
                        projectRegistry = result;
                    }).then(()=>{
                       return projectRegistry.resolve(id)
                   }).then((result)=>{
                       return result;
                   });
    }

    getEmployee(employeeId){
        let employeeRegistry
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.invoice.Employee')
                    .then((result)=>{
                        employeeRegistry = result;
                    }).then(()=>{
                       return employeeRegistry.resolve(employeeId)
                   }).then((result)=>{
                       return result
                   });
    }

    getDay(date){
        let dayRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Day')
                    .then((result)=>{
                        dayRegistry = result;
                    }).then(()=>{
                       return dayRegistry.resolve(date)
                   }).then((result)=>{
                       return result
                   });
    }
   
   addDay(date){
        const METHOD = 'addDay';
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.invoice.Employee')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get("1234");

      }).then((result)=>{

          let factory  = this.businessNetworkDefinition.getFactory();
          let transaction    = factory.newTransaction('net.biz.invoice','AddDay');		
          transaction.date = date;

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      });
    }

    linkEmployee(date,employeeId,projectId){
        const METHOD = 'linkEmployee';
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Day')
        .then((registry)=>{
            LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get("day1");
        }).then(()=>{
             let factory  = this.businessNetworkDefinition.getFactory();
              let transaction    = factory.newTransaction('net.biz.invoice','LinkEmployee');

              transaction.projectId = projectId;
              transaction.date = date;
              transaction.employeeId = employeeId;
              transaction.effortData = factory.newRelationship('net.biz.invoice','EffortData',date+employeeId);
              transaction.day  = factory.newRelationship('net.biz.invoice', 'Day', date);
          
                LOG.info(METHOD, 'Submitting transaction');
                return this.bizNetworkConnection.submitTransaction(transaction);               

        }).catch(function (error) {
          LOG.error('invoice:linkEmployee error', error);
          throw error;
      });
    }
    submitEffort(projectId,employeeId,from,to,date){
        const METHOD = 'submitEffort';
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Day')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get("day1");

      }).then((result)=>{
          let factory  = this.businessNetworkDefinition.getFactory();
          let transaction    = factory.newTransaction('net.biz.invoice','AddEffortToken');
          
          transaction.projectId = projectId;
          transaction.employeeId = employeeId;
          transaction.from = from;
          transaction.to = to;
          transaction.date = date;
          transaction.day  = factory.newRelationship('net.biz.invoice', 'Day', date);
          transaction.effortData = factory.newRelationship('net.biz.invoice','EffortData',date+employeeId)

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      }).catch(function (error) {
          LOG.error('invoice:submitEffort error', error);
          throw error;
      });
    }
    addProject(projectId,name,date,previous,startDate,endDate,location,onshore,offshore){
    const METHOD = 'addProjectByTransaction';

        return this.bizNetworkConnection.getParticipantRegistry('net.biz.invoice.Employee')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get("1234");

      }).then((result) => {

	      let factory  = this.businessNetworkDefinition.getFactory();

	      let transaction    = factory.newTransaction('net.biz.invoice','AddProject');		

		  transaction.projectId = projectId;
          transaction.name = name;
          transaction.date = date;
          transaction.previous = previous;
          transaction.startDate = startDate;
          transaction.endDate = endDate;
          transaction.location = location;
          transaction.onshore = onshore;
          transaction.offshore = offshore;
          transaction.day = factory.newRelationship('net.biz.invoice','Day',date);
            //   console.log(transaction)

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      }) 
      .catch(function (error) {
          LOG.error('invoice:addProject error', error);
          throw error;
      });
    }

    addEffortData(date,projectId,employeeId){
        const METHOD = 'addEffortData';

        return this.bizNetworkConnection.getParticipantRegistry('net.biz.invoice.Employee')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get("1234");

      }).then((result)=>{
        
          let factory  = this.businessNetworkDefinition.getFactory();
	      let transaction    = factory.newTransaction('net.biz.invoice','AddEffortData');
          transaction.day  = factory.newRelationship('net.biz.invoice', 'Day', date);
		  transaction.owner = factory.newRelationship('net.biz.invoice', 'Employee', employeeId); 			
          transaction.date = date;
          transaction.employeeId = employeeId;
          transaction.projectId = projectId;

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      }).catch(function(error){
         LOG.error('invoice:addEffortData', error);
          throw error;
      })
    }
    addEmployee(employeeId,name,location,designation){
        let employee;
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('invoice:addEmployee', 'Creating a employee');
        employee = factory.newResource('net.biz.invoice', 'Employee', employeeId);
        employee.name = name;
        employee.location = location;
        employee.designation = designation

        return this.bizNetworkConnection.getParticipantRegistry('net.biz.invoice.Employee')
                                        .then((employeeRegistry) => {
                                            return employeeRegistry.add(employee);
                                        }) // and catch any exceptions that are triggered
                                        .catch(function (error) {
                                            console.log(error);
                                            LOG.error('invoice:addEmployee', error);
                                            throw error;
                                        });
    }
    getEffortData(date,employeeId){
        let effortDataRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.EffortData')
                    .then((result)=>{
                        effortDataRegistry = result;
                    }).then(()=>{
                       return effortDataRegistry.resolve(date+employeeId)
                   }).then((result)=>{
                       return result
                   });
    }
    issueIdentity(employeeId) {
        return this.bizNetworkConnection.issueIdentity('net.biz.invoice.Employee#'+employeeId, employeeId)
    }
    
}
module.exports = Invoice;