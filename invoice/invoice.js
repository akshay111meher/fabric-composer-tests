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

    createEffortToken(employeeId,projectId,date,expectedEffort){
        
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Efforts')
                    .then((result)=>{
                        this.effortRegistry = result;
                    }).then(()=>{
                        LOG.info('Invoice:createEffortToken', 'getting factory and adding efforts');
                        let factory = this.businessNetworkDefinition.getFactory();


                        let ownerRelation = factory.newRelationship('net.biz.invoice', 'Employee',employeeId);
                        
                        LOG.info('Invoice:creating relation between employee and efforts', 'Creating relation with employee#'+employeeId);
                        let effort1 = factory.newInstance('net.biz.invoice', 'Efforts', projectId+date+employeeId);
                        effort1.owner = ownerRelation;
                        effort1.expectedEffort = expectedEffort;
                        effort1.actualEffort = ['0'];

                        LOG.info('Invoice:createEffortsToken', 'Adding these to the registry');
                        return this.effortRegistry.addAll([effort1]);
                    }).catch(function (error) {
                        console.log(error);
                        LOG.error('Invoice:createEffortToken', error);
                        throw error;
                    });

    }

    submitEfforts(employeeId,projectId,date,actualEffort){
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Efforts')
                   .then((registry)=>{
                       return registry.get(projectId+date+employeeId)
                   })
                   .then((result)=>{
                        let factory  = this.businessNetworkDefinition.getFactory();
                        
                        let transaction    = factory.newTransaction('net.biz.invoice','SubmitEfforts');		
		                
                        transaction.efforts  = factory.newRelationship('net.biz.invoice', 'Efforts', projectId+date+employeeId);
		                transaction.from = factory.newRelationship('net.biz.invoice', 'Employee', employeeId);
                        transaction.effortsValue = actualEffort;
                       
                        LOG.info('SubmitEfforts', 'Submitting transaction');

                        return this.bizNetworkConnection.submitTransaction(transaction);
                   })
                   .catch(function(error){
                        LOG.error('EmployeeRegistry:updateForTransfer', error);
                        throw error;
                   })
    }

    getEfforts(id){
        let effortRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Efforts')
                    .then((result)=>{
                        effortRegistry = result;
                    }).then(()=>{
                       return effortRegistry.resolve(id)
                   }).then((result)=>{
                       return result
                   })
    }

    addProject(projectId,name,maxBilling,location,costPerHour,employees){
        let project
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('invoice:addProject', 'Creating a project')

        project = factory.newInstance('net.biz.invoice','Project',projectId)
        project.name = name;
        project.maxBilling = maxBilling;
        project.location = location;
        project.costPerHour = costPerHour;
        project.employees = employees;

        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Project')
                                        .then((projectRegistry)=>{
                                            return projectRegistry.addAll([project])
                                        }).catch(function (error) {
                                            console.log(error);
                                            LOG.error('invoice:addProject', error);
                                            throw error;
                                        });
    }

    getProject(projectId){
        let projectRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Project')
                    .then((result)=>{
                        projectRegistry = result;
                    }).then(()=>{
                       return projectRegistry.resolve(projectId)
                   }).then((result)=>{
                       return result
                   })
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
                   })
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
                   })
    }

    addDay(date,projects){
        let day
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('invoice:addDay', 'Creating a project')

        day = factory.newInstance('net.biz.invoice','Day',date)
        day.projects = projects;

        return this.bizNetworkConnection.getAssetRegistry('net.biz.invoice.Day')
                                        .then((dayRegistry)=>{
                                            return dayRegistry.addAll([day])
                                        }).catch(function (error) {
                                            console.log(error);
                                            LOG.error('invoice:addProject', error);
                                            throw error;
                                        });
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
    
    issueIdentity(employeeId) {
        return this.bizNetworkConnection.issueIdentity('net.biz.invoice.Employee#'+employeeId, employeeId)
    }
    
}
module.exports = Invoice;