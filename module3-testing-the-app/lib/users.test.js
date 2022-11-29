const chai = require('chai');
const mongoose = require('mongoose');
const users = require('./users');
const expect = chai.expect;
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const {eventually} = require('chai-as-promised')

const sandbox = sinon.createSandbox()

chai.use(sinonChai)
chai.use(eventually)

describe('user', () => {

	let findStub;
	let sampleArgs;
	let sampleUser;
	let deleteUser;

	beforeEach(() => {
		sampleUser = {
			id: 123,
			name:'foo',
			email: 'foo@gmail.com'
		}

		findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);

		deleteUser = sandbox.stub(mongoose.Model, "delete").resolves(123)

		console.log("before------each");
	});

	afterEach(() => {
		sandbox.restore()

		console.log("after------each");
	});


	context('get', () => {
		it('should check for an id', (done) => {
			users.get(null, (err, result) => {
				expect(err).to.exist
				expect(err.message).to.equal("Invalid user id")
			})

			done();
		});

		it('should call findUserById with Id and return result', (done) => {
			let stub = sandbox.stub(mongoose.Model, 'findById').yields(null, { name: 'foo' })
			// return this or resolve this for findById
			// .yields(null, {name: 'foo'}) //error -> null, data-> {name: 'foo'}
			//// write code inside stub call process

			users.get(123, (err, result) => {
				console.log('my-result:', result);
				expect(err).to.not.exist
				expect(stub).to.have.been.calledOnce;
				expect(stub).to.have.been.calledWith(123)
				expect(result).to.be.a('object')
				expect(result).to.have.property('name').to.equal('foo')
				done();
			})
		});

		it('should catch error if there is one', (done) => {
			let stub = sinon.stub(mongoose.Model, 'findById').yields(new Error("fake error"))

			users.get(123, (err, result) => {
				expect(stub).to.have.been.calledOnce;
				expect(stub).to.have.been.calledWith(123);
				expect(result).to.not.exist;
				expect(err).to.exist;
				expect(err).to.be.instanceof(Error);
				expect(err.message).to.be.equal("fake error");

				done();
			})
		})
	});

	context('delete', () => {
		//dealing with promise - way 1 //using return
		it('should check for an id (using return then,catch)', () => {
			return users.delete(null)
				.then(result => {
					throw new Error("unexpected successfully")
				})
				.catch(err => {
					expect(err).to.be.instanceOf(Error)
					expect(err.message).to.equal("Invalid Id")
				})
		})

		//dealing with promise - way 2 //using eventually
		it('should check for an id (using return eventually)', () => {
			return expect(users.delete()).to.eventually.be.rejectedWith("Invalid Id")
		})

		// it('should check for an id (using async)', () => {
			
		// })

	});
});