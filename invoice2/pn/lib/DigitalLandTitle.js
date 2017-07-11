'use strict';
/**
 * Add a project
 * @param {net.biz.invoice.AddEffortToken} addEffortTokenTransaction the project to be added into chain
 * @transaction
 */

function onAddEffortToken(addEffortTokenTransaction){
    var effortToken;
    var projectIndex;
    var effortDataIndex;
    var dayRegistry;
    var effortDataRegistry;
    console.log('### onAddEffortTokenTransaction '+ addEffortTokenTransaction.toString());
    return getAssetRegistry('net.biz.invoice.Day').then(function(result){
        dayRegistry = result;
        effortToken = getFactory().newInstance('net.biz.invoice','EffortToken',addEffortTokenTransaction.projectId+addEffortTokenTransaction.date+addEffortTokenTransaction.employeeId);
        effortToken.from = addEffortTokenTransaction.from;
        effortToken.to = addEffortTokenTransaction.to;
        effortToken.project = addEffortTokenTransaction.projectId;
        effortToken.depricated = false;
    }).then(function(){
        var identifier = addEffortTokenTransaction.projectId + addEffortTokenTransaction.date
        for(var i=0; i<addEffortTokenTransaction.day.projects.length;i++){
            if(identifier == addEffortTokenTransaction.day.projects[i].projectId){
                projectIndex = i;
            }
        }
        return getAssetRegistry('net.biz.invoice.EffortData')
    }).then(function(result){
        effortDataRegistry = result;
        var identifier = addEffortTokenTransaction.date+addEffortTokenTransaction.employeeId;
        for(var i =0; i<addEffortTokenTransaction.day.projects[projectIndex].effortData.length;i++){
            if(identifier == addEffortTokenTransaction.day.projects[projectIndex].effortData[i].dataId){
                effortDataIndex = i;
            }
        }
        return getAssetRegistry('net.biz.invoice.Day')
    }).then(function(result){
        //addEffortTokenTransaction.day.projects[projectIndex].effortData[effortDataIndex].effortToken.push(effortToken);
        addEffortTokenTransaction.effortData.effortToken.push(effortToken)
        // return effortDataRegistry.update(addEffortTokenTransaction.day.projects[projectIndex].effortData)
        return effortDataRegistry.update(addEffortTokenTransaction.effortData)
    }).then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'GeneralEvent');
                event.data = {projectIndex:projectIndex,effortDataIndex:effortDataIndex};
                emit(event);
    });
}

/**
 * Add a project
 * @param {net.biz.invoice.AddEffortData} addEffortDataTransaction the project to be added into chain
 * @transaction
 */

function onAddEffortData(addEffortDataTransaction){
    var effortData;
    var index;
    console.log('### onAddEffortData ' + addEffortDataTransaction.toString());

    return getAssetRegistry('net.biz.invoice.EffortData').then(function(result){
        effortData = getFactory().newInstance('net.biz.invoice','EffortData',addEffortDataTransaction.date+addEffortDataTransaction.employeeId)
        effortData.employeeId = addEffortDataTransaction.employeeId;
        effortData.projectId = addEffortDataTransaction.projectId;
        effortData.effortToken = [];
        effortData.owner = addEffortDataTransaction.owner;

        return result.addAll([effortData]);
    }).then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'GeneralEvent');
                event.data = 'Sample data';
                emit(event);
    });
}

/**
 * Add a project
 * @param {net.biz.invoice.LinkEmployee} linkEmployeeTransaction the project to be added into chain
 * @transaction
 */

function onLinkEmployee(linkEmployeeTransaction){
    var projectIndex;
    console.log('### onLinkEmployeeTransaction ' + linkEmployeeTransaction.toString());

    return getAssetRegistry('net.biz.invoice.Day').then(function(result){
        var identifier = linkEmployeeTransaction.projectId+linkEmployeeTransaction.date
        for(var i=0; i<linkEmployeeTransaction.day.projects.length;i++){
            if(identifier == linkEmployeeTransaction.day.projects[i].projectId){
                projectIndex = i;
            }
        }
        return getAssetRegistry('net.biz.invoice.Day')
    }).then(function(result){
        linkEmployeeTransaction.day.projects[projectIndex].effortData.push(linkEmployeeTransaction.effortData);
        return result.update(linkEmployeeTransaction.day)
    })
    .then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'GeneralEvent');
                event.data = 'Sample data';
                emit(event);
    });
}

/**
 * Add a project
 * @param {net.biz.invoice.AddProject} addProjectTransaction the project to be added into chain
 * @transaction
 */
function onAddProject(addProjectTransaction) {
    
    var project;
    console.log('### onAddProject ' + addProjectTransaction.toString());

    return getAssetRegistry('net.biz.invoice.Project').then(function(result) { 

                project = getFactory().newInstance('net.biz.invoice', 'Project', addProjectTransaction.projectId+addProjectTransaction.date);
                project.name = addProjectTransaction.name;
                project.previous = addProjectTransaction.previous;
                project.startDate = addProjectTransaction.startDate;
                project.endDate = addProjectTransaction.endDate;
                project.location = addProjectTransaction.location;
                project.onshore = addProjectTransaction.onshore;
                project.offshore = addProjectTransaction.offshore;
                project.maxBilling = 4*parseInt(addProjectTransaction.onshore) + 10*parseInt(addProjectTransaction.offshore);
                project.effortData = [];
                
                return result.addAll([project]);
            }).then(function(){
                return getAssetRegistry('net.biz.invoice.Day')
            }).then(function(dayRegistry){
                addProjectTransaction.day.projects.push(project)
                return dayRegistry.update(addProjectTransaction.day)
            }).then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'GeneralEvent');
                event.data = 'Sample data';
                emit(event);
            });
}

/**
 * Add a day
 * @param {net.biz.invoice.AddDay} addDayTransaction the project to be added into chain
 * @transaction
 */
function onAddDay(addDayTransaction) {
    console.log('### onAddProject ' + addDayTransaction.toString());

    return getAssetRegistry('net.biz.invoice.Day').then(function(result) { 
                
                var day1 = getFactory().newInstance('net.biz.invoice', 'Day', addDayTransaction.date);
                day1.date = addDayTransaction.date;
                day1.projects = [];
                
                return result.addAll([day1]);
            }).then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'GeneralEvent');
                event.data = 'Sample data';
                emit(event);
            });
}
