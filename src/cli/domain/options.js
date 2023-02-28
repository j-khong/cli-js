const DevUtils = require('@jkhong/devutils').DevUtils;
const minimist = require('minimist');

class Options {
   static get() {
      return new Options(minimist(process.argv.slice(2)));
   }

   constructor(cliOptions) {
      this.cliOptions = cliOptions;
   }

   isEmpty() {
      return this.cliOptions._.length === 0;
   }

   getActionName() {
      return this.cliOptions._[0];
   }
   getSecondActionName() {
      return this.cliOptions._[1];
   }

   getSwitchValue(switchName) {
      const value = this.cliOptions[switchName];
      if (DevUtils.isEmpty(value)) {
         return null;
      }

      return value;
   }
   setSwitchValue(switchName, value) {
      this.cliOptions[switchName] = value;
   }
}

module.exports = Options;
