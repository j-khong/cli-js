const MainError = require('./mainError');
module.exports = class DevError extends MainError {
   constructor(message, details = '') {
      super(`Hey developer! There is a problem with the code : ${message}\n${details}`);
      this.details = details;
   }
};
