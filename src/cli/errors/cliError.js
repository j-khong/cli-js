const MainError = require('./mainError');
module.exports = class CliError extends MainError {
   constructor(message, action = '') {
      super(message);
      this.action = action;
   }
};
