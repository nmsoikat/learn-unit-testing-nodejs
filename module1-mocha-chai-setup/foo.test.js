const assert = require('assert')

describe("foo file", () => {
  context("something function", () => {
    before(() => {
      console.log("========Before========");
    })

    after(() => {
      console.log("========After========");
    })

    beforeEach(() => {
      console.log("------- Before Each --------");
    })

    afterEach(() => {
      console.log("------- After Each --------");
    })

    it("should do it", () => {
      assert.equal(1, 1)
    })
    it("should do it", () => {
      assert.equal(1, 1)
    })
    it("should do it", () => {
      assert.equal(1, 1)
    })
    it("pending")
  })
})