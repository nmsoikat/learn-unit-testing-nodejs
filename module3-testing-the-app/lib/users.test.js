const chai = require('chai');
const users = require('./users');
const expect = chai.expect;


describe('user', () => {
    context('get', () => {
        it('should check for an id', (done) => {
            users.get(null, (err, result) => {
                expect(err).to.exist
                expect(err.message).to.equal("Invalid user id")
            })

            done();
        });
    });
});