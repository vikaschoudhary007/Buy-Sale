var CreateCart = artifacts.require('./Createcart.sol');

var chai = require('chai');
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
chai.use(chaiBN);

var chaiAsPromised = require('chai-as-promised');
const { assert } = require('chai');
chai.use(chaiAsPromised);


contract('CreateCart', (accounts) => {
    let cart
    const [deployer,seller,buyer] = accounts;

    before(async () => {
        cart = await CreateCart.deployed();
    });

    describe('deployment', async () => {
        it('deploy successful', async () => {
            assert.notEqual(deployer, 0x0);
            assert.notEqual(deployer, '');
            assert.notEqual(deployer, null);
            assert.notEqual(deployer, undefined);        
        })
    });

    describe('products', async () => {
        let result, productCount
        before(async () => {
            result = await cart.createProduct("onePlus8", web3.utils.toWei('1', 'ether'), {from: seller});
            productCount = await cart.productCount()
        })

        it('createProduct', async () => {
            assert.equal(productCount,1);
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'onePlus8', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, seller, 'owner is correct')
            assert.equal(event.purchaseStatus, false, 'purchased is correct')
        })

        it('sell product', async () => {
            let oldSellerBalance
            oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new BN(oldSellerBalance);

            result = await cart.purchaseProduct(productCount, {from : buyer, value: web3.utils.toWei('1', 'Ether')})

            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'onePlus8', 'name is correct')
            assert.equal(event.price, '1000000000000000000', 'price is correct')
            assert.equal(event.owner, buyer, 'owner is correct')
            assert.equal(event.purchaseStatus, true, 'purchased is correct')

            let newSellerBalance
            newSellerBalance = await web3.eth.getBalance(seller)
            newSellerBalance = new BN(newSellerBalance)

            let price
            price = web3.utils.toWei('1', 'ether');
            price = new BN(price);

            const expectedBalance = oldSellerBalance.add(price);

            assert.equal(newSellerBalance.toString(), expectedBalance.toString());
            
        })

    })

})