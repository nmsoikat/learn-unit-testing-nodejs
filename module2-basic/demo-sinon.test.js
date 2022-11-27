const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const demoSinon = require('./demo-sinon')

const expect = chai.expect;
chai.use(sinonChai)


describe("demo sinon", () => {
  context("test doubles", () => {

    it("should spy on log", () => {
      let spy = sinon.spy(console, 'log') //(library, function)

      demoSinon.foo()

      //so that it can call one time.
      //expect(spy.calledOnce).to.be.true; //console.log() //check get called only once
      // or //using chai plugin
      expect(spy).to.have.been.calledOnce;
      spy.restore() //reset the counting
    })

    it("should stub console.warn", () => {
      let stub = sinon.stub(console, 'warn').callsFake(() => {console.log("stub catch the console.warn");})

      demoSinon.foo();

      expect(stub).to.have.been.calledOnce; //stop calling console.warn()
      //expect(stub).to.have.been.calledWith("console warn was called") //parameter  match
      stub.restore()
    })
  })
})