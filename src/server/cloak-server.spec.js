var mockery = require('mockery');

describe('cloak server', function() {
    beforeEach(function() {
        mockery.enable({ useCleanCache: true });
    });

    var cloak;
    var cloakConfig;
    beforeEach(function() {
        mockery.registerAllowable('./cloak-server');
        cloak = jasmine.createSpyObj('cloak', ['configure', 'run']);
        cloak.configure.and.callFake(function(_config_) {
            cloakConfig = _config_;
        });
        mockery.registerMock('cloak', cloak);
    });

    afterEach(function() {
        mockery.deregisterAll();
    });

    afterEach(function() {
        mockery.disable();
    });

    it('calls configure', function() {
        require('./cloak-server')({});

        expect(cloak.configure).toHaveBeenCalled();
    });

    it('calls run', function() {
        require('./cloak-server')({});

        expect(cloak.run).toHaveBeenCalled();
    });
});
