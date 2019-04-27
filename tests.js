let assert = require('assert');
const CLI = require('./index');

class CustomManual extends CLI.Manual {
    // methods that can be overriden
    // about(cliOptions) { }
    // getSwitchPrefix() {}
    // printHelp(cliOptions) {}
    // displaySectionHeader(section) {}
    // displayAction(action) {}
}

class CustomCli extends CLI.Interface {
    manageException(e) { throw new Error('oups'); } // don't display errors and rethrow exception
}

function setManualContentThrowsDevError(content) {
    const cli = new CLI.Interface();
    assert.throws(() => cli.setManualContent(content), CLI.Errors.Dev);
}

describe('CLI creation', function () {
    describe('#setManualContent()', function () {
        it('should throw when the manual content is null', function () {
            setManualContentThrowsDevError(null);
        })
        it('should throw when the manual content is undefined', function () {
            setManualContentThrowsDevError(undefined);
        })
        it('should throw when the manual content is empty', function () {
            setManualContentThrowsDevError({});
        })
        it('should throw when the manual content misses appName', function () {
            setManualContentThrowsDevError({ binName: "", actionsGroups: [] });
        })
        it('should throw when the manual content misses binName', function () {
            setManualContentThrowsDevError({ appName: "", actionsGroups: [] });
        })
        it('should throw when the manual content misses actionsGroups', function () {
            setManualContentThrowsDevError({ appName: "", appName: "" });
        })
        it('should pass when the manual content is correct', function () {
            const cli = new CLI.Interface();
            cli.setManualContent({ appName: "", binName: "", actionsGroups: [] });
        })
    })
    // describe('#setManualContent() + launch()', function () {
    //     it('should throw when the manual object is null', function () {
    //         const cli = new CustomCli();
    //         // try {

    //         assert.throws(() => cli.launch(), Error);//CLI.Errors.Dev);
    //         // } catch (e) { console.log(e.message); }

    //         // cli.setManual(null);
    //     })
    //     // it('should throw when the manual object is undefined', function () {
    //     //     const cli = new CLI.Interface();
    //     //     cli.setManual(undefined)
    //     //     assert.throws(() => cli.launch(), CLI.Errors.Dev);
    //     // })
    // })
})
