/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a simple sample that will demonstrate how to use the
// API connecting to a HyperLedger Blockchain Fabric
//
// The scenario here is using a simple model of a participant of 'Student'
// and a 'Test' and 'Result'  assets.

'use strict';


const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const Table = require('cli-table');
const winston = require('winston');
let config = require('config').get('gettingstarted');

// these are the credentials to use to connect to the Hyperledger Fabric
let participantId = config.get('participantId');
let participantPwd = config.get('participantPwd');
const LOG = winston.loggers.get('application');


/** Class for the land registry*/
class LandRegistry {

  /**
   * Need to have the mapping from bizNetwork name to the URLs to connect to.
   * bizNetwork nawme will be able to be used by Composer to get the suitable model files.
   *
   */
    constructor() {

        this.bizNetworkConnection = new BusinessNetworkConnection();
        this.CONNECTION_PROFILE_NAME = config.get('connectionProfile');
        this.businessNetworkIdentifier = config.get('businessNetworkIdentifier');
        console.log(this.CONNECTION_PROFILE_NAME,this.businessNetworkIdentifier,participantId,participantPwd)
    }

  /** @description Initalizes the LandRegsitry by making a connection to the Composer runtime
   * @return {Promise} A promise whose fullfillment means the initialization has completed
   */
    init() {
        return this.bizNetworkConnection.connect(this.CONNECTION_PROFILE_NAME, this.businessNetworkIdentifier, participantId, participantPwd)
      .then((result) => {
          this.businessNetworkDefinition = result;
          LOG.info('LandRegistry:<init>', 'businessNetworkDefinition obtained', this.businessNetworkDefinition.getIdentifier());
      })
      // and catch any exceptions that are triggered
      .catch(function (error) {
          throw error;
      });

    }

  /** Updates a fixes asset for selling..
  @return {Promise} resolved when this update has compelted
  */
    registerForBuy(id,owner){
        const METHOD = 'registerForBuy'

        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitile')
       .then((registry)=>{
          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get('PersonID'+id);
       }).then((result)=>{
           let factory        = this.businessNetworkDefinition.getFactory();
          console.log(factory)
	      let transaction    = factory.newTransaction('net.biz.digitalPropertyNetwork','ConfirmPropertyForSale');		
		  transaction.title  = factory.newRelationship('net.biz.digitalPropertyNetwork', 'LandTitle', "PersonID"+id);
		  transaction.buyer = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', "LocationID"+owner); 	

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
       }).catch(function (error) {
          LOG.error('LandRegsitry:updateForSale', error);
          throw error;
      });
    }
    updateForSale(id,owner) {
        const METHOD = 'updateForSale';

        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
      .then((registry) => {

          LOG.info(METHOD, 'Getting assest from the registry.');
          return registry.get('PersonID'+id);

      }).then((result) => {

	      let factory  = this.businessNetworkDefinition.getFactory();
        //   console.log(factory)
	      let transaction    = factory.newTransaction('net.biz.digitalPropertyNetwork','RegisterPropertyForSale');		
		  transaction.title  = factory.newRelationship('net.biz.digitalPropertyNetwork', 'LandTitle', "PersonID"+id);
		  transaction.seller = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', "LocationID"+owner); 	
          console.log(transaction)


// // second way of submitting transaction start
//           let serializer = this.businessNetworkDefinition.getSerializer();
//           let resource = serializer.fromJSON({
//             '$class': 'net.biz.digitalPropertyNetwork.RegisterPropertyForSale',
//             'title': id
//           });   
          
//           return this.bizNetworkConnection.submitTransaction(resource);
         

// // second way of submitting transaction end

          LOG.info(METHOD, 'Submitting transaction');
          return this.bizNetworkConnection.submitTransaction(transaction);
      }) // and catch any exceptionersonRegistry()
            //       .then(function(result){
            //         console.log(result)
            //       })s that are triggered
      .catch(function (error) {
          LOG.error('LandRegsitry:updateForSale', error);
          throw error;
      });
    }
  /** registerNewLand
    * @return {Promise} resolved when the assests have been created
  */

//    registerNewLand(id,newOwner) {
//             return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
//                        .then((registry)=>{
//                             LOG.info(METHOD, 'Getting assest from the registry.');
//                             return registry.get(id);
//                        }).then((result)=>{
                                
//                                 let factory        = this.businessNetworkDefinition.getFactory();
//                                 console.log(factory)
//                                 let transaction    = factory.newTransaction('net.biz.digitalPropertyNetwork','ConfirmPropertyForSale');		
//                                 transaction.title  = factory.newRelationship('net.biz.digitalPropertyNetwork', 'LandTitle', id);
//                                 transaction.owner = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', newOwner); 	
//                        })
//    }
   /** person registry
    * @return {Promise} resolved when the assests have been created
  */
  
    personRegistry() {
        let personRegistry;
        LOG.info('LandRegistry:personRegistry', 'getting person registry for "net.biz.digitalPropertyNetwork.Person"');
       
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
        .then((registry) => {
            personRegistry = registry
          return personRegistry.resolveAll()
      })
    }
    
    issueIdentity(personId) {
        return this.bizNetworkConnection.issueIdentity('net.biz.digitalPropertyNetwork.Person#LocationID'+personId, 'LocationID'+personId)
    }
    addPerson(personId,firstName,lastName){
        let owner
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a person');
        owner = factory.newResource('net.biz.digitalPropertyNetwork', 'Person', 'LocationID'+personId);
        owner.firstName = firstName;
        owner.lastName = lastName;

        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
                                        .then((personRegistry) => {
                                            return personRegistry.add(owner);
                                        }) // and catch any exceptions that are triggered
                                        .catch(function (error) {
                                            console.log(error);
                                            LOG.error('LandRegsitry:_bootstrapTitles', error);
                                            throw error;
                                        });
    }
  /** bootstrap into the resgitry a few example land titles
    * @return {Promise} resolved when the assests have been created
  */
  
    _bootstrapTitles() {
        LOG.info('LandRegistry:_bootstrapTitles', 'getting asset registry for "net.biz.digitalPropertyNetwork.LandTitle"');
        let owner;
        LOG.info('about to get asset registry');
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle') // how do I know what this name is?

    .then((result) => {
        // got the assest registry for land titles
        LOG.info('LandRegistry:_bootstrapTitles', 'got asset registry');
        this.titlesRegistry = result;
    }).then(() => {
        LOG.info('LandRegistry:_bootstrapTitles', 'getting factory and adding assets');
        let factory = this.businessNetworkDefinition.getFactory();

        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a person');
        owner = factory.newInstance('net.biz.digitalPropertyNetwork', 'Person', 'LocationID1234567890');
        owner.firstName = 'Fred';
        owner.lastName = 'Bloggs';

        /** Create a new relationship for the owner */
        let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'LocationID1234567890');
        
        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
        let landTitle1 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'PersonID1148');
        landTitle1.owner = ownerRelation;
        landTitle1.information = 'A nice house in the country';

        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#2');
        let landTitle2 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'PersonID6789');
        landTitle2.owner = ownerRelation;
        landTitle2.information = 'A small flat in the city';

        LOG.info('LandRegistry:_bootstrapTitles', 'Adding these to the registry');
        return this.titlesRegistry.addAll([landTitle1, landTitle2]);

    }).then(() => {
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
    })
      .then((personRegistry) => {
          return personRegistry.add(owner);
      }) // and catch any exceptions that are triggered
      .catch(function (error) {
          console.log(error);
          LOG.error('LandRegsitry:_bootstrapTitles', error);
          throw error;
      });

    }
    existsAsset(id){
        let assetRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
                   .then((registry)=>{
                       assetRegistry = registry
                       return assetRegistry.exists('PersonID'+id)
                   })
    }
    existsPerson(id){
        let personRegistry
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
                   .then((registry)=>{
                       personRegistry = registry
                       return personRegistry.exists('LocationID'+id)
                   })
    }
    tranferProperty(id,newOwner,newInfo){
        let assestRegistry
        let info
        let landTitle1
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')    
                   .then((registry)=>{
                       assestRegistry = registry
                       return assestRegistry.get('PersonID'+id)
                   }).then((resource)=>{
                        console.log(resource.titleId,resource.information)
                        info = resource.information
                        let factory = this.businessNetworkDefinition.getFactory();
                        // //transfer without permission
                        //         let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'LocationID'+newOwner);
        
                        //         LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
                        //         let landTitle1 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'PersonID'+id);
                        //         landTitle1.owner = ownerRelation;
                        //         landTitle1.information = info;
                        //         // console.log(landTitle1)
                        //         return assestRegistry.update(landTitle1)
                        // transfer with permission// // 
                        if(resource.forSale){
                                let factory = this.businessNetworkDefinition.getFactory();
                                let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'LocationID'+newOwner);
        
                                LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
                                let landTitle1 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'PersonID'+id);
                                landTitle1.owner = ownerRelation;
                                landTitle1.information = newInfo;
                                // console.log(landTitle1)
                                return assestRegistry.update(landTitle1)
                        }else{
                            throw Error("resource is not for sale")
                        }
                        // createAsset(id,newOwner,info)
                   })
                   .catch((error)=>{
                        console.log(error)
                   })
    }

    createAsset(id,ownerId,info){
        
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
                    .then((result)=>{
                        this.titlesRegistry = result;
                    }).then(()=>{
                        LOG.info('LandRegistry:_bootstrapTitles', 'getting factory and adding assets');
                        let factory = this.businessNetworkDefinition.getFactory();


                        let ownerRelation = factory.newRelationship('net.biz.digitalPropertyNetwork', 'Person', 'LocationID'+ownerId);
                        
                        LOG.info('LandRegistry:_bootstrapTitles', 'Creating a land title#1');
                        let landTitle1 = factory.newInstance('net.biz.digitalPropertyNetwork', 'LandTitle', 'PersonID'+id);
                        landTitle1.owner = ownerRelation;
                        landTitle1.information = info;

                        LOG.info('LandRegistry:_bootstrapTitles', 'Adding these to the registry');
                        return this.titlesRegistry.addAll([landTitle1]);
                    }).catch(function (error) {
                        console.log(error);
                        LOG.error('LandRegsitry:_bootstrapTitles', error);
                        throw error;
                    });

    }
    
    getAsset(id){
        let titlesRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
                    .then((result)=>{
                        titlesRegistry = result;
                    }).then(()=>{
                       return titlesRegistry.resolve('PersonID'+id)
                   }).then((result)=>{
                       let location = {
                           LocationID: result.owner.personId,
                           city: result.owner.firstName,
                           state: result.owner.lastName
                       }
                        return {PersonID:result.titleId,information:result.information,location:location}
                   })
    }

    getPerson(id){
        let personRegistry
        return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person')
        .then((registry) => {
            personRegistry = registry
      }).then(()=>{
          return personRegistry.resolve('LocationID'+id)
      }).then((person)=>{
            return ({LocationID:person.personId,city:person.firstName,state:person.lastName})
      })
    }

    removeAsset(id){
        let assestRegistry
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')    
                   .then((registry)=>{
                       assestRegistry = registry
                       return assestRegistry.get('PersonID'+id)
                    }).then((resource)=>{
                        return assestRegistry.remove(resource)
                    })
                
    }

  /**
   * List the land titles that are stored in the Land Title Resgitry
   * @return {Promise} resolved when fullfiled will have listed out the titles to stdout
   */
    listTitles() {        //   console.log(response)

        const METHOD = 'listTitles';

        let landTitleRegistry;
        let personRegistry;

        LOG.info(METHOD, 'Getting the asset registry');
    // get the land title registry and then get all the files.
        return this.bizNetworkConnection.getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle')
      .then((registry) => {
          landTitleRegistry = registry;

          return this.bizNetworkConnection.getParticipantRegistry('net.biz.digitalPropertyNetwork.Person');
        }).then((registry)  => {
          personRegistry = registry;

          LOG.info(METHOD, 'Getting all assest from the registry.');
          return landTitleRegistry.resolveAll();

        })

    .then((aResources) => {

        LOG.info(METHOD, 'Current Land Titles');

        // //simple return
        // return aResources

        // //simple return 
      // instantiate
        let table = new Table({
            head: ['TitleID', 'OwnerID', 'First Name', 'Surname', 'Description', 'ForSale']
        });
        let arrayLength = aResources.length;
        for(let i = 0; i < arrayLength; i++) {

            let tableLine = [];



            tableLine.push(aResources[i].titleId);
            tableLine.push(aResources[i].owner.personId);
            tableLine.push(aResources[i].owner.firstName);
            tableLine.push(aResources[i].owner.lastName);
            tableLine.push(aResources[i].information);
            tableLine.push(aResources[i].forSale ? 'Yes' : 'No');
            table.push(tableLine);
        }        //   console.log(response)


      // Put to stdout - as this is really a command line app
        return(table);
    })


    // and catch any exceptions that are triggered
    .catch(function (error) {
        console.log(error);
      /* potentially some code for generating an error specific message here */
        this.log.error(METHOD, 'uh-oh', error);
    });

    }

  /**
   * @description - run the listtiles command
   * @param {Object} args passed from the command line
   * @return {Promise} resolved when the action is complete
   */
    static listCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()
    .then(() => {
        return lr.listTitles();
    })

    .then((results) => {
        LOG.info('Titles listed');
        LOG.info('\n'+results.toString());
    })
      .catch(function (error) {
        /* potentially some code for generating an error specific message here */
          throw error;
      });
    }

  /**
   * @description - run the add default assets command
   * @param {Object} args passed from the command line
   * @return {Promise} resolved when complete
   */
    static addDefaultCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()

    .then(() => {
        return lr._bootstrapTitles();
    })

    .then((results) => {
        LOG.info('Default titles added');
    })
      .catch(function (error) {
        /* potentially some code for generating an error specific message here */
          throw error;
      });
    }

  /**
   * @description - run the listtiles command
   * @param {Object} args passed from the command line
   * @return {Promise} resolved when the action is complete
   */
    static submitCmd(args) {

        let lr = new LandRegistry('landRegsitryUK');


        return lr.init()

    .then(() => {
        return lr.updateForSale();
    })

    .then((results) => {
        LOG.info('Transaction Submitted');
    })
      .catch(function (error) {
        /* potentially some code for generating an error specific message here */
          throw error;
      });
    }
}
module.exports = LandRegistry;