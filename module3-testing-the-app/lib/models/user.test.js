const chai = require('chai')
const expect = chai.expect

const User = require('./user')

describe("User model", () => {
    it("should check error for required field are missing", (done) => {
        const user = new User(); //create empty user

        //name, email filed are required but we have not pass any value when create a new User()
        //it will generate error

        // user.validate //mongodb method
        user.validate(err => {
            // err.error.name //mongodb validation error format
            expect(err.errors.name).to.exist //name is required so this filed will exist in `errors` object
            expect(err.errors.email).to.exist //email is required so this email filed will exist in `errors` object
            expect(err.errors.age).to.not.exist //not required filed so it will not exist in `errors` object

            done()
        })
    })

    it("should have optional age field", (done) => {
        const user = new User({
            name: 'foo',
            email: 'foo@gmail.com',
            age: 33
        })

        expect(user)
            .to.have.property('age')
            .to.equal(33)

        done()
    })
})