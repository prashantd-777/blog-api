const errorMessage = require(`../constant/messages`);
const errorKeys = Object.keys(errorMessage);
const keyMappings = {};
errorKeys.forEach(key => {
    Object.assign(keyMappings, { [key]: key });
});
module.exports = keyMappings;