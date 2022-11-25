const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const demo = require('./demo')

describe('demo', () => {
  context('add', () => {
    it("should add two numbers", () => {
      expect(demo.add(1,2)).to.equal(3)
    })
  })

  context('add callback', () => {
    it("should add two numbers after delay (callback test)", (done) => {
      demo.addCallBack(1,2, (err, result) => {
        expect(err).to.not.exist
        expect(result).to.equal(3)
        done()
      })
    })

    it("should add two number after delay (callback test) return (without done method)", () => {
      return demo.addCallBack(1,2, (err, result) => {
        expect(err).to.not.exist
        expect(result).to.equal(3)
      })
    })
  })

  context("add promise", () => {
    //promise test way 1
    it("should add two number using promise", (done) => {
      demo.addPromise(1,2).then(result => {
        expect(result).to.equal(3)
        done()
      }).catch(err => {
        // console.log(err);
        done(err)
      })
    })

    //promise test way 2
    // it("should add two number using promise and return (without done method)", () => {
    //   return demo.addPromise(1,2)
    //   .then(result => {
    //     expect(result).to.equal(3)
    //   })
    //   .catch(err => {
    //     expect(err).to.not.exist
    //   })
    // })

    //promise test way 3
    it("should add two number using async", async() => {
      const result = await demo.addPromise(1,2)
      expect(result).to.equal(3)
    })

    //promise test way 4 //using chai plugin "chai-as-promised"
    it("should add two number using async (chai-as-promised)", async() => {
      await expect(demo.addPromise(1,2)).to.eventually.equal(3)
    })
  })
})