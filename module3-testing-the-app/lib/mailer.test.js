const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

var sandbox = sinon.createSandbox()
var mailer = rewire('./mailer');

describe('mailer', () => {
    let emailStub;

    beforeEach(() => {
        emailStub = sandbox.stub().resolves("Done")
        mailer.__set__('sendEmail', emailStub)
    })

    afterEach(() => {
        sandbox.restore();
        mailer = rewire('./mailer.js')
    })

    context("sendWelcomeEmail", () => {
        it("should check for email and name", async () => {
            await expect(mailer.sendWelcomeEmail()).to.eventually.be.rejectedWith("Invalid input")
            await expect(mailer.sendWelcomeEmail("foo@gmail.com")).to.eventually.be.rejectedWith("Invalid input")
        })

        it("should call sendEmail with email and message", async () => {
            await mailer.sendWelcomeEmail("foo@gmail.com", "foo")
            expect(emailStub).to.have.been.calledWith("foo@gmail.com", "Dear foo, welcome to our family!")
        })
    })

    context("sendPasswordResetEmail", () => {
        it("should check for email", async () => {
            await expect(mailer.sendPasswordResetEmail()).to.eventually.be.rejectedWith("Invalid input")
        })

        it("should call sendEmail with email and message", async () => {
            await mailer.sendPasswordResetEmail("foo@gmail.com")
            expect(emailStub).to.have.been.calledWith("foo@gmail.com", "Please click http://some_link to reset your password.")
        })
    })

    context("sendEmail", () => {
        let sendEmail

        beforeEach(() => {
            mailer = rewire('./mailer.js')
            sendEmail = mailer.__get__("sendEmail")
        })

        it("should check for email and body", async () => {
            await expect(sendEmail()).to.eventually.be.rejectedWith("Invalid input")
            await expect(sendEmail("foo@gmail.com")).to.eventually.be.rejectedWith("Invalid input")
        })

        it("should call sendEmail with email and message", async () => {
            let result = await (sendEmail('foo@gmail.com', 'welcome'))

            expect(result).to.equal("Email sent")
        })
    })
})