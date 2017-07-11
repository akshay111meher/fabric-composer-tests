'use strict';

/**
 * Process a effort
 * @param {net.biz.invoice.SubmitEfforts} effortsTransaction the efforts to be added into chain
 * @transaction
 */
function onSubmitEfforts(effortsTransaction) {
    console.log('### onSubmitEfforts ' + effortsTransaction.toString());
    effortsTransaction.effort.actualValue.push(effortsTransaction.effortValue);
    return getAssetRegistry('net.biz.invoice.Efforts').then(function(result) {    
                return result.update(effortsTransaction.efforts);
            }).then(function(){
                var event = getFactory().newEvent('net.biz.invoice', 'EffortEvent');
                event.data = 'Sample data';
                emit(event);
            });
}