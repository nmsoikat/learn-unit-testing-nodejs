const rewire = require('rewire');
const chai = require('chai');
const mongoose = require('mongoose');
const expect = chai.expect;
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised');

let users = rewire('./users');
const mailer = require('./mailer')

const sandbox = sinon.createSandbox()

chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('user', () => {

	let findStub;
	let sampleArgs;
	let sampleUser;
	let deleteStub;
	let mailerStub;

	beforeEach(() => {
		sampleUser = {
			id: 123,
			name: 'foo',
			email: 'foo@gmail.com',
			save: sandbox.stub().resolves()
		}

		findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);

		deleteStub = sandbox.stub(mongoose.Model, "remove").resolves("just_return_fake_string")
		mailerStub = sandbox.stub(mailer, "sendWelcomeEmail").resolves("fake_email")

		console.log("before------each");
	});

	afterEach(() => {
		sandbox.restore()

		console.log("after------each");

		users = rewire('./users') //reset, after any changes made using rewire
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
			sandbox.restore();

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
			sandbox.restore()
			let stub = sandbox.stub(mongoose.Model, 'findById').yields(new Error("fake error"))

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

		it("should call user.remove", async () => {
			let result = await users.delete(123)

			expect(result).to.equal('just_return_fake_string')
			expect(deleteStub).to.have.been.calledWith({ _id: 123 })
		})

	});

	context('create', () => {
		let FakeUserClass, saveStub, result;

		beforeEach(async () => {

			saveStub = sandbox.stub().resolves(sampleUser) //return a function
			// console.log(saveStub()); //return promise //{name: foo, ...}
			FakeUserClass = sandbox.stub().returns({ save: saveStub })

			users.__set__('User', FakeUserClass)
			result = await users.create(sampleUser)
			// console.log("result");
			// console.log(result);
		});

		it("should reject invalid arguments", async () => {
			// users.create(null).catch(err => {
			// 	expect(err).to.be.instanceOf(Error)
			// 	expect(err.message).to.equal("Invalid arguments")
			// })

			// users.create({}).catch(err => {
			// 	expect(err).to.be.instanceOf(Error)
			// 	expect(err.message).to.equal("Invalid arguments")
			// })

			await expect(users.create()).to.eventually.be.rejectedWith("Invalid arguments")
			await expect(users.create({ name: 'foo' })).to.eventually.be.rejectedWith("Invalid arguments")
			await expect(users.create({ email: 'foo@devapp.com' })).to.eventually.be.rejectedWith("Invalid arguments")

		})

		it("should called with new", async () => {
			expect(FakeUserClass).to.have.been.calledWithNew;
			expect(FakeUserClass).to.have.been.calledWith(sampleUser)
		})

		it("should save the user", async () => {
			expect(saveStub).to.have.been.called
		})

		it("should call mailer with email and name", () => {
			expect(mailerStub).to.have.been.calledWith(sampleUser.email, sampleUser.name)
		})

		//for catch block
		it("should reject error", async () => {
			saveStub.rejects(new Error('fake'))

			await expect(users.create(sampleUser)).to.eventually.be.rejectedWith('fake')
		})
	})

	context('update user', () => {
		it("should find user by id", async () => {
			await users.update(123, { name: 'bar' })
			expect(findStub).to.have.been.calledWith(123)
		})

		it("should call user.save", async () => {
			await users.update(123, { name: 'bar' })

			expect(sampleUser.save).to.have.been.calledOnce
		})

		it("should reject if there is an error", async () => {
			//edit our find stub that can throw error
			findStub.throws(new Error('fake'))

			//findStub will call when we call users.update()
			await expect(users.update(123, { name: 'bar' })).to.eventually.be.rejectedWith('fake')
		})
	})

	context('reset password', () => {
		let resetStub;

		beforeEach(() => {
			resetStub = sandbox.stub(mailer, 'sendPasswordResetEmail').resolves("reset")
		})

		it("should check for email", async () => {
			await expect(users.resetPassword()).to.eventually.be.rejectedWith("Invalid email")
		})

		it("should call send passwordResetEmail", async () => {
			await users.resetPassword("foo@bar.com");
			expect(resetStub).to.have.been.calledWith('foo@bar.com')
		})
	})
});