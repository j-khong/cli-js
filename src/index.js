const Interface = require("./cli/cli");
const Manual = require("./cli/domain/manual");
const Logger = require("./cli/log");

const Input = require("./cli/errors/inputError");
const Conf = require("./cli/errors/confError");
const Dev = require("./cli/errors/devError");
const Cli = require("./cli/errors/cliError");
const Errors = {
  Input,
  Conf,
  Dev,
  Cli,
};

module.exports = {
  Interface,
  Manual,
  Logger,
  Errors,
};
