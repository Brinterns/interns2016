var _ = require('lodash');

module.exports = function(originalObject, objectWithNewProperties, deepCloneRequired) {
    var newObject = Object.assign({}, originalObject, objectWithNewProperties);

    if(deepCloneRequired) {
        newObject = _.cloneDeep(newObject);
    }

    return newObject;
};
