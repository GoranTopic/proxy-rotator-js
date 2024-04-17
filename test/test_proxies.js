import ProxyRotator from '../index.js'
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect

// slogan: when you like a little risk with you proxies
// proxies to test with 
let test_proxies = [ '139.59.1.14:8080', '94.45.74.60:8080', 
    '161.35.70.249:3128', '217.182.170.224:80', '222.138.76.6:9002',
    '218.252.206.89:80',  '18.214.66.210:80', '120.234.203.171:9002' ]

// check if it is able to read from difrent files
describe('testing testing proxies', () => {
    // test if it can process a string point to a file
    it('testing proxeis', () => {
        // make rotator 
        let rotator = new ProxyRotator(test_proxies);
        rotator.test()
        assert.deepEqual(test_proxies,rotator.getPool())
    })
})

