let assert = require("assert");
const CLI = require("../src/index");

class CustomManual extends CLI.Manual {
  // methods that can be overriden
  // about(cliOptions) { }
  // getSwitchPrefix() {}
  // printHelp(cliOptions) {}
  // displaySectionHeader(section) {}
  // displayAction(action) {}
}

class CliForTests extends CLI.Interface {
  manageException(e) {
    throw e;
  } // don't display errors and rethrow exception
  displayHeader(header) {}
  executeAction(action, options) {
    this.testAction = action;
    this.testOptions = options;
  }
}

function setManualContentThrowsDevError(content) {
  const cli = new CLI.Interface();
  assert.throws(() => cli.setManualContent(content), CLI.Errors.Dev);
}

describe("CLI creation", function () {
  describe("#setManualContent()", function () {
    it("should throw when the manual content is null", function () {
      setManualContentThrowsDevError(null);
    });
    it("should throw when the manual content is undefined", function () {
      setManualContentThrowsDevError(undefined);
    });
    it("should throw when the manual content is empty", function () {
      setManualContentThrowsDevError({});
    });
    it("should throw when the manual content misses appName", function () {
      setManualContentThrowsDevError({ binName: "", actionsGroups: [] });
    });
    it("should throw when the manual content misses binName", function () {
      setManualContentThrowsDevError({ appName: "", actionsGroups: [] });
    });
    it("should throw when the manual content misses actionsGroups", function () {
      setManualContentThrowsDevError({ appName: "", appName: "" });
    });
    it("should pass when the manual content is correct", function () {
      const cli = new CLI.Interface();
      cli.setManualContent({ appName: "", binName: "", actionsGroups: [] });
    });
  });
  describe("#setManual() + launch()", function () {
    it("should throw when setManual() is not called", function () {
      const cli = new CliForTests();
      launchTestWithException(cli, new CLI.Errors.Dev());
    });
    it("should throw when the manual object is null", function () {
      const cli = new CliForTests();
      cli.setManual(null);
      launchTestWithException(cli, new CLI.Errors.Dev());
    });
    it("should throw when the manual object is undefined", function () {
      const cli = new CliForTests();
      cli.setManual(undefined);
      launchTestWithException(cli, new CLI.Errors.Dev());
    });
  });
});

describe("CLI use", function () {
  describe("#string switch value ", function () {
    it("should get string value when a string value is provided (space)", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      const switchValue = '"some string value"';
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName)
      );
      compareResults(cli, actionName, switchName, switchValue, "string");
    });
    it("should get string value when a string value is provided with =", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      const switchValue = '"some string value"';
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}=${switchValue}`,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName)
      );
      compareResults(cli, actionName, switchName, switchValue, "string");
    });
    it("should get default string value when a string switch is used", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      const defaultS = "myDefault";
      const defaultValue = { value: defaultS };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, defaultS, "string");
    });
    it("should get string value when a string number value is provided (space)", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      const switchValue = '"1234"';
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName)
      );
      compareResults(cli, actionName, switchName, switchValue, "string");
    });
    it("should reject when no value and no default value", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      setUpAndLaunchTestWithException(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName),
        new CLI.Errors.Cli()
      );
    });
    it("should reject when empty value and no default value", function () {
      const actionName = "someAction";
      const switchName = "stringSwitch";
      setUpAndLaunchTestWithException(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          "--stringSwitch",
          "",
        ],
        createOneActionOneSwitchManualContent(actionName, switchName),
        new CLI.Errors.Cli()
      );
    });
  });
  describe("#number switch value ", function () {
    it("should get number value when a number value is provided (space)", function () {
      const actionName = "someAction";
      const switchName = "intSwitch";
      const switchValue = "1234";
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName)
      );
      compareResults(cli, actionName, switchName, switchValue, "number");
    });
    it("should get default number value when a number switch is used", function () {
      const actionName = "someAction";
      const switchName = "intSwitch";
      const defaultS = 4;
      const defaultValue = { value: defaultS };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, defaultS, "number");
    });
    it("should reject when no value and no default value", function () {
      const actionName = "someAction";
      const switchName = "intSwitch";
      setUpAndLaunchTestWithException(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(actionName, switchName),
        new CLI.Errors.Cli()
      );
    });
  });
  describe("#boolean switch value ", function () {
    it("should get true when a switch is specified, with no value, and default true (space)", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = true;
      const defaultValue = { value: true };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
    it("should get true when a switch is specified, with true value, and default true (space)", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = true;
      const defaultValue = { value: true };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
    it("should get false when a switch is specified, with false value, and default true (space)", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = false;
      const defaultValue = { value: true };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
    it("should true when a switch is specified, with no value, and default false (space) => not logical to get default false value when switch is alone, with no value", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = true;
      const defaultValue = { value: false };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
    it("should get true when a switch is specified, with true value, and default false (space)", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = true;
      const defaultValue = { value: false };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
    it("should get false when a switch is specified, with false value, and default false (space)", function () {
      const actionName = "someAction";
      const switchName = "boolSwitch";
      const switchValue = false;
      const defaultValue = { value: false };
      const cli = setUpAndLaunchTest(
        [
          "/usr/local/bin/node",
          "execFilename",
          "someAction",
          `--${switchName}`,
          switchValue,
        ],
        createOneActionOneSwitchManualContent(
          actionName,
          switchName,
          defaultValue
        )
      );
      compareResults(cli, actionName, switchName, switchValue, "boolean");
    });
  });
});

function setUpAndLaunchTest(argv, manualContent) {
  process.argv = argv;
  const cli = new CliForTests();
  cli.setManualContent(manualContent);
  cli.launch();
  return cli;
}

function setUpAndLaunchTestWithException(
  argv,
  manualContent,
  expectedException
) {
  process.argv = argv;
  const cli = new CliForTests();
  cli.setManualContent(manualContent);
  launchTestWithException(cli, expectedException);
}

function launchTestWithException(cli, expectedException) {
  cli
    .launch()
    .then((res) => {
      assert.fail("must not pass here");
    })
    .catch((err) => {
      assert.equal(err.constructor.name, expectedException.constructor.name);
    });
}

function compareResults(cli, actionName, switchName, switchValue, valueType) {
  assert.equal(cli.testAction.name, actionName);
  const actualSwitchValue = cli.testOptions.getSwitchValue(switchName);
  assert.equal(actualSwitchValue, switchValue);
  assert.equal(typeof actualSwitchValue, valueType);
}

function createOneActionOneSwitchManualContent(
  actionName,
  switchName,
  defaultValue = null
) {
  return {
    appName: "",
    binName: "",
    actionsGroups: [
      {
        name: "some name",
        desc: "some desc",
        actions: [
          {
            name: actionName,
            desc: "someActionDesc",
            switches: [{ name: switchName, desc: "", default: defaultValue }],
            action: () => {},
          },
        ],
      },
    ],
  };
}
