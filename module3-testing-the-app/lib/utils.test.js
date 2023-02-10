const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var crypto = require('crypto');

var config = require('./config');
var utils = require('./utils');
var sandbox = sinon.createSandbox()

describe('utils', () => {
    let secretStub, createHashStub, hash, updateStub, digestStub;

    beforeEach(() => {
        secretStub = sandbox.stub(config, 'secret').returns("fake_secret")
        digestStub = sandbox.stub().returns('ABC123')
        updateStub = sandbox.stub().returns({
            digest: digestStub
        })
        createHashStub = sandbox.stub(crypto, 'createHash').returns({
            update: updateStub
        })
        hash = utils.getHash('foo')
    })

    afterEach(() => {
        sandbox.restore()
    })

    it("should return null if invalid staring is pass", async () => {
        sandbox.reset()

        let hash2 = utils.getHash(null);
        let hash3 = utils.getHash(123);
        let hash4 = utils.getHash({ bar: "test" });

        expect(hash2).to.be.null;
        expect(hash3).to.be.null;
        expect(hash4).to.be.null;

        expect(createHashStub).to.not.have.been.called;
    })

    it("should get secret from config", async () => {
        expect(secretStub).to.have.been.called;
        expect(secretStub()).to.equal("fake_secret")
    })

    it("should call crypto with correct settings and return hash", () => {
        expect(createHashStub).to.have.been.calledWith('md5');
        expect(updateStub).to.have.been.calledWith('foo_fake_secret');
        expect(digestStub).to.have.been.calledWith('hex');
        expect(hash).to.equal('ABC123')
    })
})