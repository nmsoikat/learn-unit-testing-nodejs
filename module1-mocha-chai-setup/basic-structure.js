const assert = require('assert')

//one describe for whole file
describe("file to be tested", () => {
  //each context for each function
  context("function to tested", () => {
    //"it" for each single test
    it("should add", () => {
      //expected, output
      assert.equal(1,1)
    })

    it("should do something", () => {
      assert.deepEqual({name: 'joe'}, {name: "joe"})
    })

    //it is a test that have nothing
    //used for reminder //need to test later
    it("should pending test")
  })
})