'use strict';

/**
 * Process a property that is held for sale
 * @param {net.biz.digitalEmployeeNetwork.RegisterEmployeeForTransfer} employeeForTransfer the property to be sold
 * @transaction
 */
function onRegisterEmployeeForTransfer(employeeForTransfer) {
    console.log('### onRegisterEmployeeForTransfer ' + employeeForTransfer.toString());
    var currentParticipant = getCurrentParticipant().toString();
    var location = employeeForTransfer.employee.current.toString()
 
    if(currentParticipant == location){
        employeeForTransfer.employee.information = currentParticipant+" has kept it for transfer"
        employeeForTransfer.employee.forTransfer = true
    }else{
        employeeForTransfer.employee.forTransfer = false
    }
       
    return getAssetRegistry('net.biz.digitalEmployeeNetwork.Employee').then(function(result) {    
                return result.update(employeeForTransfer.employee);
            }).then(function(){
                var event = getFactory().newEvent('net.biz.digitalEmployeeNetwork', 'EmployeeEvent');
                event.data = 'Sample Data';
                emit(event);
            });
}