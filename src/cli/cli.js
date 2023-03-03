const DevUtils = require('@jkhong/devutils').DevUtils;
const FunctionUtils = require('@jkhong/devutils').FunctionUtils;
require('colors');

const Manual = require('./domain/manual');
const Options = require('./domain/options');
const Logger = require('./log');
const CliError = require('./errors/cliError');
const DevError = require('./errors/devError');

class CLI {
   constructor() {
      this.logger = new Logger();
      this.man = null;
   }

   setManualContent(content) {
      this.man = new Manual(content);
   }
   setManual(customManual) {
      this.man = customManual;
   }
   setLogger(logger) {
      this.logger = logger;
   }

   async launch() {
      try {
         if (DevUtils.isNotSet(this.man)) {
            throw new DevError(
               'The manual is not configured',
               'use setManualContent(content) or setManual(customManual) before calling launch()',
            );
         }

         this.displayHeader();

         const options = Options.get();
         if (options.isEmpty()) {
            throw new CliError(this.logger.formatError(['please choose an action to perform']));
         }

         const actionName = options.getActionName();
         const action = this.man.getAction(actionName);
         if (DevUtils.isNotSet(action)) {
            throw new CliError(this.logger.formatError([`Unknown action ${actionName}`]));
         }

         const aErrors = [];
         const aBefore = [`For the action [${actionName}] :`];
         action.switches.forEach((aswitch) => {
            const value = options.getSwitchValue(aswitch.name);
            const isBool = 'boolean' === typeof value;
            if (null === value) {
               if (DevUtils.isNotSet(aswitch.default)) {
                  aErrors.push(` you must provide ${this.man.getSwitchPrefix()}${aswitch.name}=yourValue`);
               } else {
                  options.setSwitchValue(aswitch.name, aswitch.default.value);
               }
            } else if (isBool) {
               if (DevUtils.isNotSet(aswitch.default)) {
                  aErrors.push(` you must provide ${this.man.getSwitchPrefix()}${aswitch.name}=yourValue`);
               } else {
                  if (typeof aswitch.default.value !== 'boolean') {
                     options.setSwitchValue(aswitch.name, aswitch.default.value);
                  }
               }
            }
         });
         if (aErrors.length > 0) {
            throw new CliError(this.logger.formatError(aBefore.concat(aErrors)), actionName);
         }

         await this.executeAction(action, options);
      } catch (e) {
         this.manageException(e);
      }
   }

   async executeAction(action, options) {
      for (const aswitch of action.switches) {
         if (DevUtils.isSet(aswitch.validate)) {
            try {
               const value = options.getSwitchValue(aswitch.name);
               if (!aswitch.validate(value)) {
                  throw new Error(`value [${value}] is not accepted for ${aswitch.name}`);
               }
            } catch (e) {
               throw new CliError(this.logger.formatError([e.message]), options.getActionName());
            }
         }
      }
      if (FunctionUtils.isAsync(action.action)) {
         await action.action(options);
      } else {
         action.action(options);
      }
   }

   manageException(e) {
      if (e instanceof CliError) {
         console.error(e.message.bold.red);
         console.log(`see the manual : ./${this.man.getBinName()} help ${e.action}`);
         console.log('');
         //doc.printHelp();
      } else {
         this.logger.displayError(e.message);
      }
   }

   displayHeader() {
      const header = [this.man.getAppName()];
      if (DevUtils.isSet(this.man.getAppSubTitle())) {
         header.push(this.man.getAppSubTitle());
      }
      if (DevUtils.isSet(this.man.getAppVersion())) {
         header.push(this.man.getAppVersion());
      }

      console.log(this.logger.formatHeader(header).bold.cyan);
   }
}
module.exports = CLI;
