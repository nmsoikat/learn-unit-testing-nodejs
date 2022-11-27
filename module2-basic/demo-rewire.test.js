const chai = require('chai')
const expect = chai.expect;
const rewire = require('rewire')
const sinon = require('sinon')

var demoRewire = rewire('./demo-rewire')
/**
 * change variable or function using rewire
 * __set__
 * __get__
 */

describe('demo rewire', () => {
  context('stub private function', () => {
    it('should stub create file', async () => {
      let createStub = sinon.stub(demoRewire, 'createFile').resolves('create_stub')
      let callStub = sinon.stub().resolves('callDB_stub')

      demoRewire.__set__('callDB', callStub); //callDB replace by callStub

      let result = await demoRewire.bar('test.txt')

      expect(result).to.equal('callDB_stub')
      // expect(createStub).to.have.been.calledOnce
      // expect(createStub).to.have.been.calledWith('text.txt')
      // expect(callStub).to.have.been.calledOnce
    });
  });
});

