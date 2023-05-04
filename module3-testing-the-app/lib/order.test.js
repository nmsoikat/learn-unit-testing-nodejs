const chai = require('chai')
const expect = chai.expect;
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const Order = require('./order')
const sandbox = sinon.createSandbox()

describe('Order Class', () => {
    let warnStub, dateSpy, user, items, order;
    beforeEach(() => {
        warnStub = sandbox.stub(console, 'warn');
        dateSpy = sandbox.spy(Date, 'now');
        user = { id: 1, name: 'foo' };
        items = [
            { name: 'Book', price: 10 },
            { name: 'Dice set', price: 5 }
        ];

        order = new Order(123, user, items);
    })

    afterEach(() => {
        sandbox.restore();
    })


    it("should create instance or Order and calculate total + shipping", () => {
        expect(order).to.be.instanceof(Order);
        expect(dateSpy).to.have.been.calledTwice;
        expect(order)
            .to.have.property('ref')
            .to.equal(123);
        expect(order)
            .to.have.property('user')
            .to.deep.equal(user);
        expect(order)
            .to.have.property('items')
            .to.deep.equal(items);
        expect(order)
            .to.have.property('status')
            .to.equal('Pending');
        expect(order)
            .to.have.property('createdAt')
            .to.be.a('Number');
        expect(order)
            .to.have.property('updatedAt')
            .to.be.a('Number');
        expect(order)
            .to.have.property('subtotal')
            .to.be.a('Number')
            .to.be.equal(15);
        expect(order)
            .to.have.property('shipping')
            .to.equal(5);
        expect(order)
            .to.have.property('total')
            .to.equal(20)

        expect(order.save).to.be.a('function')
        expect(order.cancel).to.be.a('function')
        expect(order.ship).to.be.a('function')
    })

    it('should update status to active and return order details', () => {
        const result = order.save();

        expect(dateSpy).to.have.calledThrice;
        expect(order)
            .to.have.property('status')
            .to.equal('Active')
        expect(order)
            .to.have.property('updatedAt')
            .to.be.a('Number')

        expect(result).to.be.a('Object')
        expect(result)
            .to.have.property('user')
            .to.equal('foo')
    })

    it('Should cancel an order, update status and set shipping and total to zero', () => {
        const result = order.cancel()
        expect(dateSpy).to.have.been.calledThrice;

        expect(order)
            .to.have.property('status')
            .to.equal('Cancelled')
        expect(order)
            .to.have.property('updatedAt')
            .to.be.a('Number')
        expect(order)
            .to.have.property('shipping')
            .to.equal(0)
        expect(order)
            .to.have.property('total')
            .to.equal(0)

        expect(warnStub).to.have.been.calledWith("Order cancelled")

        expect(result).to.be.true
    });

    it('Should update status to shipped', () => {
        order.ship()

        expect(dateSpy).to.have.been.calledThrice

        expect(order)
            .to.have.property('status')
            .to.equal('Shipped')
        expect(order)
            .to.have.property('updatedAt')
            .to.be.a('Number')
    });
})