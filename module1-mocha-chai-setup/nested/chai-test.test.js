const chai = require('chai')
const expect = chai.expect

describe("chai test", () => {
  it("should compare value", () => {
    expect(1).to.equal(1)
    expect(1).to.be.a("number")
    expect({}).to.be.a("object")
    expect([1,2,3].length).to.equal(3)
    expect({name: 'foo'}).to.deep.equal({name: 'foo'})
    expect({name: 'foo'}).to.have.property('name')
    expect({name: 'foo'}).to.have.property('name').to.equal('foo')
    expect(5 > 8).to.be.false
    expect('bar').to.be.a('string').with.lengthOf(3)
  })

  it("should other compare", () => {
    expect(null).to.null
    expect(null).to.not.exist

    expect(undefined).to.undefined
    expect(undefined).to.not.exist

    expect(1).to.exist
  })

  it("process", () => {
    console.log(process.env.NODE_ENV);
  })
})