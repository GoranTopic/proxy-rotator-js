import ProxyRotator from '../index.js'
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect

// slogan: when you like a little risk with you proxies
// proxies to test with 
let test_proxies = [ '139.59.1.14:8080', '94.45.74.60:8080', 
    '161.35.70.249:3128', '217.182.170.224:80', '222.138.76.6:9002',
    '218.252.206.89:80',  '18.214.66.210:80', '120.234.203.171:9002' ]

// check shuffle option
describe('shuffle option', () => {
    it('shuffle proxies when true', () => {
        // make rotator with shuffle option set to true
        let rotator = new ProxyRotator(test_proxies, { shuffle: true });
        // get pool
        let pool = rotator.getPool();
        // check if the proxies are shuffled
        assert.notDeepEqual(test_proxies, pool);
    });

    it('do not shuffle proxies when false', () => {
        // make rotator with shuffle option set to false
        let rotator = new ProxyRotator(test_proxies, { shuffle: false });
        // get pool
        let pool = rotator.getPool();
        // check if the proxies are not shuffled
        assert.deepEqual(test_proxies, pool);
    });
});

