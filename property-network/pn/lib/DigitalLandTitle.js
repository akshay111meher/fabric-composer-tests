'use strict';

/**
 * Process a property that is held for sale
 * @param {net.biz.digitalPropertyNetwork.RegisterPropertyForSale} propertyForSale the property to be sold
 * @transaction
 */
function onRegisterPropertyForSale(propertyForSale) {
    console.log('### onRegisterPropertyForSale ' + propertyForSale.toString());
    var currentParticipant = getCurrentParticipant().toString();
    var owner = propertyForSale.title.owner.toString()
    if(currentParticipant == owner){
        propertyForSale.title.information = currentParticipant+" has kept it for transfer"
        propertyForSale.title.forSale = true
    }else{
        propertyForSale.title.forSale = false
    }
    return getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle').then(function(result) {
                    return result.update(propertyForSale.title);
                }
            );
}

/**
 * Process a property that is held for sale
 * @param {net.biz.digitalPropertyNetwork.ConfirmPropertyForBuy} propertyForSale the property to be bought
 * @transaction
 */
// function onConfirmPropertyForSale(propertyForSale) {
//     console.log('### onConfirmPropertyForSale ' + propertyForSale.toString());
//     propertyForSale.title.forSale = false;

//     return getAssetRegistry('net.biz.digitalPropertyNetwork.LandTitle').then(function(result) {
//             return result.update(propertyForSale.title);
//         }
//     );
// }