const DevUtils = require('@jkhong/devutils');
const SimpleSchema = require('simpl-schema').default;
const InputError = require('../errors/inputError');
const DevError = require('../errors/devError');

const Switch = new SimpleSchema({
   name: String,
   desc: String,
   default: { type: Object, blackbox: true, optional: true },
});
const Action = new SimpleSchema({
   name: String,
   desc: String,
   switches: [Switch],
   action: { type: Object, blackbox: true, optional: true },
});
const ActionsGroup = new SimpleSchema({
   name: String,
   desc: String,
   actions: { type: Array },
   'actions.$': { type: Action },
});
const ManualContent = new SimpleSchema({
   appName: String,
   binName: String,
   appSubTitle: { type: String, optional: true },
   appVersion: { type: String, optional: true },
   actionsGroups: { type: Array },
   'actionsGroups.$': { type: ActionsGroup },
   about: { type: String, optional: true },
});

class Manual {
   constructor(content) {
      if (DevUtils.isNotSet(content)) {
         throw new DevError('the manual content is empty');
      }
      SimpleSchema.defineValidationErrorTransform((error) => {
         const msg = 'you may have a look to the manual content you passed';
         return new DevError(error.message, msg);
      });
      ManualContent.validate(content);

      this.content = content;
      this.content.actionsGroups.push({
         name: 'manual',
         desc: 'Misc',
         actions: [
            {
               name: 'help',
               desc: 'this help',
               switches: [],
               action: (cliOptions) => {
                  this.printHelp(cliOptions);
               },
            },
            {
               name: 'about',
               desc: `Discover the purpose of ${this.getBinName()}`,
               switches: [],
               action: (cliOptions) => {
                  this.about(cliOptions);
               },
            },
         ],
      });
      ManualContent.validate(this.content);
   }

   getAction(actionName) {
      let ret = null;
      for (const actionsGroup of this.content.actionsGroups) {
         for (const action of actionsGroup.actions) {
            if (action.name == actionName) {
               ret = action;
            }
         }
      }
      return ret;
   }

   getAppName() {
      return this.content.appName;
   }
   getBinName() {
      return this.content.binName;
   }
   getAppSubTitle() {
      return this.content.appSubTitle;
   }
   getAppVersion() {
      return this.content.appVersion;
   }

   about(cliOptions) {
      console.error(`\n${this.getAppName()}\n`);
      console.error(this.content.about);
   }

   getSwitchPrefix() {
      return '--';
   }

   printHelp(cliOptions) {
      const actionName = cliOptions.getSecondActionName();
      if (actionName) {
         let theAction = null;
         let theSection = null;
         for (const actionsGroup of this.content.actionsGroups) {
            for (const action of actionsGroup.actions) {
               if (action.name == actionName) {
                  theAction = action;
                  theSection = actionsGroup;
               }
            }
         }
         if (theAction) {
            this.displaySectionHeader(theSection);
            this.displayAction(theAction);
            return;
         }

         throw new InputError(`No manual entry for ${actionName}`);
      }

      console.error(`\nSyntax: ./${this.getBinName()} <action> ${this.getSwitchPrefix()}<flag> <value>`);

      for (const actionsGroup of this.content.actionsGroups) {
         this.displayActions(actionsGroup);
      }
   }

   displayActions(section) {
      this.displaySectionHeader(section);
      for (const action of section.actions) {
         this.displayAction(action);
      }
   }

   displaySectionHeader(section) {
      console.error('\n' + section.desc);
      console.error('------------------------------');
   }

   displayAction(action) {
      const switchPrefix = `  ${this.getSwitchPrefix()}`;
      var padding = 35;
      console.error(`${action.name.padEnd(padding)} - ${action.desc}`);
      for (const aswitch of action.switches) {
         var str = `${switchPrefix}${aswitch.name}`;
         if (aswitch.default) {
            str += ` (default: ${aswitch.default})`;
         }
         console.error(`${str.padEnd(padding)} - ${aswitch.desc}`);
      }
      console.log('');
   }
}
module.exports = Manual;
