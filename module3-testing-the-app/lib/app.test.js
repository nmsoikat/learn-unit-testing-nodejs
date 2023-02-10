const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const request = require('supertest');

var app = rewire('./app');
var users = require('./users');
var auth = require('./auth');
var sandbox = sinon.createSandbox()

describe('app', () => {
    afterEach(() => {
        app = rewire('./app');
        sandbox.restore()
    })

    context('GET /', () => {
        it("should get /", (done) => {
            request(app)
                .get('/')
                .expect(200) //status code
                .end((err, response) => {
                    expect(response.body).to.have.property('name').to.equal('Foo Fooing Bar')
                    done(err) //it will let us know there is any problem or crashes during the test
                })
        })
    })

    context('POST /user', () => {
        let createStub, errorStub;

        it('should call user.create', (done) => {
            createStub = sandbox.stub(users, 'create').resolves({ name: 'foo' })
            request(app)
                .post('/user')
                .expect(200)
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('name').to.equal('foo');
                    done(err)
                })
        })

        it('should call handleError on error', (done) => {
            //if we do reject "then block will execute"
            createStub = sandbox.stub(users, 'create').rejects(new Error('fake_error'));

            errorStub = sandbox.stub().callsFake((response, error) => {
                return response.status(400).json({ error: 'fake' })
            })

            app.__set__('handleError', errorStub)

            request(app)
                .post('/user')
                .expect(400)
                .end((err, response) => {
                    expect(createStub).to.have.been.calledOnce;
                    expect(errorStub).to.have.been.calledOnce;
                    expect(response.body).to.have.property('error').to.equal('fake')
                    done(err)
                })
        })
    })
})

