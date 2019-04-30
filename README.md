# Purpose

cli-js allows you to quickly set up a command line interface.

Let's say you want to create a command line program (myBoilerplateGenerator) which creates your own boiler plate for:
 - react
 - react native
 - meteor

Provided you have written the code to generate your boiler plates, you can use them this way:

```sh
./myBoilerplateGenerator generateReact --projectName myNewReactProject --namespace NRP --useRedux

./myBoilerplateGenerator generateReactNative --projectName myNewReactNativeProject

./myBoilerplateGenerator generateMeteor --projectName myNewMeteorProject --namespace NRP --version 1.6
```

# How to create a minimum cli

create your myBoilerplateGenerator file (no extension)

```javascript
#!/usr/bin/env node
const CLI = require("@jkhong/cli-js");

try {
    // minimal manual content 
    const manualContent = {
        appName: "Boiler plate generator",
        binName: "myBoilerplateGenerator",
        actionsGroups: []
    };
    const cli = new CLI.Interface();
    cli.setManualContent(manualContent);
    cli.launch();
}
catch (e) {
    console.log(e);
}
```

make your script executable
```sh
chmod +x myBoilerplateGenerator
```

and run the following commands
```sh
# notifies no action is given
./myBoilerplateGenerator

# displays default help menu
./myBoilerplateGenerator help
```

# How to plug your code to the cli

configure the manualContent object

```javascript
// import your code
const ReactActions = require('./react.js');
const ReactNativeActions = require('./reactNative.js');
const MeteorActions = require('./meteor.js');

// use your code in methods to be plugged to the manual
// the methods get the user input values with the cliOptions object
function ReactPlug(cliOptions){
    ReactActions.genBoilerPlate(
        cliOptions.getSwitchValue("projectName"),
        cliOptions.getSwitchValue("namespace"),
        cliOptions.getSwitchValue("useRedux")
    );
}
function ReactNativePlug(cliOptions){
    ReactNativeActions.genBoilerPlate(
        cliOptions.getSwitchValue("projectName")
    );
}
function MeteorPlug(cliOptions){
    MeteorActions.genBoilerPlate(
        cliOptions.getSwitchValue("projectName"),
        cliOptions.getSwitchValue("namespace"),
        cliOptions.getSwitchValue("version")
    );
}

// build the manual content
const manualContent = {
    appName: "Boiler plate generator",
    binName: "myBoilerplateGenerator",
    actionsGroups: [
        {
            name: "react actions",
            desc: "some cli utils for react projects",
            actions: [{
                name: "generateReact",
                desc: "generate a react boiler plate",
                switches: [
                    {
                        name: "projectName",
                        desc: "the name of the project"
                    },
                    {
                        name: "namespace",
                        desc: "the namespace of the project"
                    },
                    {  // optional switch due to the default value
                        name: "useRedux",
                        desc: "configure for redux",
                        default: {value: false}
                    }
                ],
                action: ReactPlug
            }
            ]
        },
        {
            name: "react native actions",
            desc: "some cli utils for react native projects",
            actions: [{
                name: "generateReactNative",
                desc: "generate a react native boiler plate",
                switches: [
                    {
                        name: "projectName",
                        desc: "the name of the project"
                    }
                ],
                action: ReactNativePlug
            }
            ]
        },
        {
            name: "meteor actions",
            desc: "some cli utils for meteor projects",
            actions: [{
                name: "generateMeteor",
                desc: "generate a meteor boiler plate",
                switches: [
                    {
                        name: "projectName",
                        desc: "the name of the project"
                    },
                    {
                        name: "namespace",
                        desc: "the namespace of the project"
                    },
                    {  // optional switch due to the default value
                        name: "version",
                        desc: "meteor version to use",
                        default: {value: 1.5}
                    }
                ],
                action: MeteorPlug
            }
            ]
        }
    ]
};
```

# Customize your cli

## The manual
You can add optional values to the header like a subtitle and the version and add to help an about.

```javascript
const manualContent = {
    appName: "Boiler plate generator",
    binName: "myBoilerplateGenerator",
    appSubTitle: " the best on the market place",
    appVersion: `v.1.2.3`,
    about: "some descriptive information about your script"
};
```

If you don't like the way things are displayed, you can inherit the Manual class to redefine your way.

```javascript
const CLI = require("@jkhong/cli-js");

[...]

class CustomManual extends CLI.Manual {
// methods that can be overriden
    // about(cliOptions) { }
    // getSwitchPrefix() {}
    // printHelp(cliOptions) {}
    // displaySectionHeader(section) {}
    // displayAction(action) {}
}

try {
    const cli = new CLI.Interface();
    cli.setManual(new CustomManual(manualContent));
    cli.launch();
}
catch (e) {
    console.log(e);
}
```

## The cli

You can customize the way cli displays error by inheriting methods

```javascript
class CustomCli extends CLI.Interface {
// methods that can be overriden
    displayHeader(header) {
        // display hat you want here
    }
    manageException(e) {
        // display hat you want here
    }
```
