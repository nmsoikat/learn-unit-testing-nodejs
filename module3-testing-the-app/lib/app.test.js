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

    context("Get /", () => {
        it("should get /", (done) => {
            request(app)
                .get('/')
                .expect(200) //status code
                .end((err, res) => {
                    expect(res.body).to.have.property('name').to.equal('Foo Fooing Bar')
                    done(err) //it will let us know there is any problem or crashes during the test
                })
        })
    })

    context("POST /user", () => {
        let createStub, errorStub;

        it("should call user.create", (done) => {
            createStub = sandbox.stub(users, 'create').resolves({ name: 'foo' })

            request(app)
                .post('/user')
                .send({ name: 'foo' })
                .expect(200)
                .end((err, res) => {
                    expect(createStub)
                        .to.have.been.calledOnce

                    expect(res.body)
                        .to.have.property('name')
                        .to.equal('foo')

                    done(err)
                })
        })

        it("should call handleError on error", (done) => {
            createStub = sandbox.stub(users, 'create').rejects(new Error('fake_error'))
            errorStub = sandbox.stub().callsFake((res, err) => {
                return res.status(400).json({ error: 'fake' })
            })

            app.__set__('handleError', errorStub)

            request(app)
                .post('/user')
                .send({ name: 'foo' })
                .expect(400)
                .end((err, res) => {
                    expect(createStub).to.have.been.calledOnce
                    expect(errorStub).to.have.been.calledOnce
                    expect(res.body)
                        .to.have.property('error')
                        .to.equal('fake')

                    done(err)
                })
        })
    })

    context("Delete /user/:id", () => {
        let deletedStub, authStub

        beforeEach(() => {
            fakeAuth = (req, res, next) => {
                return next();
            }

            authStub = sandbox.stub(auth, 'isAuthorized').callsFake(fakeAuth)

            app = rewire('./app')
        })

        it("should call auth check function and users.delete on success", (done) => {
            deletedStub = sandbox.stub(users, 'delete').resolves('fake_delete')

            request(app)
                .delete('/user/123')
                .expect(200)
                .end((err, res) => {
                    expect(authStub).to.have.been.calledOnce;
                    expect(deletedStub).to.have.been.calledWithMatch(123);
                    expect(res.body).to.equal('fake_delete')

                    done(err)
                })
        })

        it("should call handle error or error", (done) => {
            let errorStub, deletedStub

            deletedStub = sandbox.stub(users, 'delete').rejects(new Error('fake_error'))
            errorStub = sandbox.stub().callsFake((res, err) => {
                return res.status(400).json({ error: 'fake' })
            })

            app.__set__('handleError', errorStub)

            request(app)
                .delete('/user/123')
                .expect(400)
                .end((err, res) => {
                    expect(deletedStub).to.have.been.calledOnce;
                    expect(errorStub).to.have.been.calledOnce;
                    expect(res.body)
                        .to.have.property('error')
                        .to.equal('fake')

                    done(err)
                })
        })
    })

    context("handleError", () => {
        let statusStub, jsonStub, res, handleError

        beforeEach(() => {
            jsonStub = sandbox.stub().returns('done')
            statusStub = sandbox.stub().returns({
                json: jsonStub
            })
            res = {
                status: statusStub
            }

            handleError = app.__get__('handleError')
        })

        it("should check error instance and format message", (done) => {
            let result = handleError(res, new Error('fake'))

            expect(statusStub).to.have.been.calledWith(400)
            expect(jsonStub).to.have.been.calledWith({
                error: 'fake'
            })
            done()
        })

        it("should return object without changing it if  not instance of error ", (done) => {
            let result = handleError(res, { id: 1, message: 'fake' })

            expect(statusStub).to.have.been.calledWith(400)
            expect(jsonStub).to.have.been.calledWith({
                id: 1,
                message: 'fake'
            })
            done()

        })
    })
})

