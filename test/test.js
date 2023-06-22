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
describe('read form proxy files', () => {
    // test if it can process a string point to a file
    it('reading file with newlines', () => {
        // make rotator with file with newlines
        let proxies_file = './assets/http_proxies_with_newlines.txt';
        // make rotator with file with newlines
        let rotator_with_newlines = new ProxyRotator(proxies_file); 
        // get pool
        let pool = rotator_with_newlines.getPool();
        assert.deepEqual(test_proxies, pool)
    })
    // test if it can process a file with spaces
    it('reading file with spaces', () => {
        // make rotator with file with spaces
        let proxies_file = './assets/http_proxies_with_spaces.txt';
        // make rotator with file with spaces
        let rotator_with_spaces = new ProxyRotator(proxies_file);
        // get pool
        let pool = rotator_with_spaces.getPool();
        assert.deepEqual(test_proxies, pool)
    })
    // test if it can process a file with commas
    it('reading file with commas', () => {
        // make rotator with file with commas
        let proxies_file = './assets/http_proxies_with_commas.txt';
        // make rotator with file with spaces
        let rotator_with_commas = new ProxyRotator(proxies_file);
        // get pool
        let pool = rotator_with_commas.getPool();
        assert.deepEqual(test_proxies, pool)
    })
});

// check the functionality of the rotator
describe('basic functionality', () => {
    // test if it can process a string point to a file
    it('add proxies array', () => {
        // make rotator 
        let rotator = new ProxyRotator(test_proxies);
        // get pool
        assert.deepEqual(test_proxies,rotator.getPool())
    })
    // adding one by one
    it('add proxy one by one ', () => {
        // make rotator
        let rotator = new ProxyRotator();
        // add proxies one by one
        for(let proxy of test_proxies) rotator.add(proxy)
        // test
        assert.deepEqual(test_proxies,rotator.getPool())
    })
    // remove one by one
    it('remove one', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        // remove proxies one by one
        let removed = test_proxies.filter(e => e !== test_proxies[3])
        rotator.remove(test_proxies[3])
        // test
        assert.deepEqual(removed, rotator.getPool())
    })
    // remove one by one
    it('remove proxy one by one ', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        // remove proxies one by one
        for(let proxy of test_proxies) rotator.remove(proxy)
        // test
        assert.deepEqual([], rotator.getPool())
    })
    // test if set dead works
    it('set dead to graveyard', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        //  set dead
        rotator.setDead(test_proxies[3])
        // test
        assert.deepEqual(
            rotator.getGraveyard().includes(test_proxies[3]),
            true
        )
    })
    it('set dead remove from pool', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        //  set dead
        rotator.setDead(test_proxies[3])
        // test
        assert.equal(
            rotator.getPool().includes(test_proxies[3]),
            false
        )
    })
    it('resurect proxy from graveyard', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        //  set dead
        rotator.setDead(test_proxies[3])
        // set alive
        rotator.resurect(test_proxies[3])
        // test
        assert.equal(rotator.getPool().includes(test_proxies[3]), true)
    })
    // test if set dead works
    it('set dead proxy alive', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        //  set dead
        rotator.setDead(test_proxies[3])
        // set alive
        rotator.setAlive(test_proxies[3])
        // test
        assert.equal(rotator.getPool().includes(test_proxies[3]), true)
    })
    // test if set dead works
    it('get alive', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        // set alive
        rotator.setAlive(test_proxies[3])
        // get alive
        let proxy = rotator.getAlive()
        // test
        assert.equal(proxy, test_proxies[3])
    })
    // test rotation
    it('test rotation', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        let removed = test_proxies.filter(e => e !== test_proxies[3])
        // set dead
        rotator.setDead(test_proxies[3])
        // test if every proxy returned with next matches removed 
        for(let i = 0; i < removed.length; i++){
            let proxy = rotator.next()
            assert.equal(proxy, removed[i])
        }
    })
    // test resurrect timer
    it('resurect timer', function(done){
        // set timeout
        this.timeout(1100);
        // make rotator
        let rotator = new ProxyRotator(test_proxies, { revive_timer: 1000 } );
        let removed = test_proxies.filter(e => e !== test_proxies[3])
        // set dead
        rotator.setDead(test_proxies[3])
        // wait for resurect timer
        setTimeout(() => { 
            assert.equal(
                rotator.getPool().includes(test_proxies[3]),
                true
            );
            done();
        }, 1000);
    })
});

// check return type of proxy
describe('Test return type', () => {
    // test if it return as obj when option is set
    it('test default return string type', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        // remove proxies one by one
        let proxy = rotator.next()
        // test if it is string
        assert.equal(typeof proxy, 'string')
    })
    it('teset if it return object when passed returnAs obj', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies, { returnAs: 'object' });
        // remove proxies one by one
        let proxy = rotator.next()
        // test if it is string
        assert.equal(typeof proxy, 'object')
    })
    it('teset if it return obj when passed as paramter', () => {
        // make rotator
        let rotator = new ProxyRotator(test_proxies);
        // remove proxies one by one
        let proxy = rotator.next({ returnAs:'obj'})
        // test if it is string
        assert.equal(typeof proxy, 'object')
        // try to get sring
        let proxy2 = rotator.next({ returnAs: 'str'})
        // test if it is string
        assert.equal(typeof proxy2, 'string')
    })
});


