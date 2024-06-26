import fs from 'fs';
import Queue from './Queue.js';
import Proxy from './Proxy.js';
import makeRequestWithProxy from './utils/makeRequestWithProxy.js';

class ProxyRotator {
    constructor(proxies, options={} ){
        this.pool = new Queue();
        this.graveyard = [];
        // handle options
        let { returnAs, revive_timer, shuffle, protocol, assume_aliveness, check_on_next } = options;
        // how long to wait before reviving a dead proxy
        // default: 30 minutes
        this.revive_timer = revive_timer ?? 1000 * 60 * 30;
        // return type of proxy, either 'string' or 'object'
        this.returnAs = returnAs? this._handleReturnAsInput(returnAs) : 'string';
        // assume a a protocol for all proxies
        this.protocol = protocol ?? null;
        // shuffle the proxies before adding them to the queue
        this.shuffle = shuffle ?? false;
        // assume all proxies are alive when first added instead of 'new'
        this.assume_aliveness = assume_aliveness ?? false;
        // check if proxies are alive when they are added to the queue
        this.check_on_next = check_on_next ?? false;
        // examine proxies passed
        // check if it is a file path
        if( typeof proxies === 'string' ){
            // parse file
            proxies = this._parseFile(proxies);
            // add proxies to queue
            proxies.forEach( p => this._add(p) );
        }else if( this._isArray(proxies) ){
            // add proxies to queue
            proxies.forEach( p => this._add(p) );
        }
        // shuffle proxies
        if(this.shuffle){
            let shuffled = this._shuffleArray(this.pool.toArray());
            this.pool = new Queue();
            shuffled.forEach( p => this.pool.enqueue(p) );
        }
    }

    getGraveyard(){ return this.graveyard.map(p => p.proxy) }

    getGraveyardSize(){ return this.graveyard.length }

    getPool(){ return this.pool.toArray().map(p => p.proxy) }

    getPoolSize(){ return this.pool.size }

    add(proxies){ // add proxy to queue
        if(this._isArray(proxies)) // if passed an array
            for(let proxy of proxies) this._add(proxy);
        else // single file
            this._add(proxies);
    }

    _add(proxy){ // add proxy to queue
        let p = new Proxy(proxy, this.protocol, this.assume_aliveness);
        this.pool.enqueue(p);
    }

    remove(proxy){ // remove proxy from queue
        if(this._isArray(proxy)) // if passed an array
            for(let p of proxy) this._remove(p);
        else // single file
            this._remove(proxy);
    }

    _remove(proxy){ // remove proxy from queue
        this.pool.toArray().forEach( (p,i) => {
            if(p.equals(proxy)) this.pool.remove(i);
        });
    }

    getAlive(){ // get a random alive proxy
        let proxies = this.pool.toArray();
        for( let proxy of proxies )
            if(proxy.isAlive()) return proxy.proxy;
    }

    setAlive(proxy){ // set a proxy to alive
        let proxies = this.pool.toArray()
        for( let p of proxies ) // if proxy is in queue
            if(p.equals(proxy)) return p.setAlive();
        // if proxy is in graveyard
        for( let p of this.graveyard )
            if(p.equals(proxy)) return this.resurect(p);
    }

    resurect( proxy ){
        // get proxy from graveyard
        let p = this.graveyard.find( p => p.equals(proxy) );
        // if proxy is not in graveyard
        if(!p) return;
        // remove from graveyard
        this.graveyard = this.graveyard.filter( p => !p.equals(proxy) );
        // set as new
        p.setNew();
        // add to queue
        this.pool.enqueue(p);
    }

    setDead(proxy){ // set a proxy to dead
        this.pool.toArray().forEach( (p,i) => {
            if(p.equals(proxy)){
                p.setDead(); // set to dead
                // remove from queue
                this.pool.remove(i);
                // add to graveyard
                this.graveyard.push(p);
            }
        })
        //  revive proxy after revive_timer
        setTimeout( () => this.resurect(proxy), this.revive_timer );
    }

    kill(proxy){ // kill a proxy
        return this.setDead(proxy);
    }

    next(options={}){
        let { returnAs } = options;
        // resurect a proxy from the graveyard
        if(this.check_on_next) _resurection();
        // if there are no proxies in the pool
        if(this.pool.size === 0) return null ;
        // remove from front 
        let proxy = this.pool.dequeue();
        // add to back
        this.pool.enqueue(proxy);
        // if parameter is passed
        if(returnAs) returnAs = this._handleReturnAsInput(returnAs)
        // else use default
        else returnAs = this.returnAs;
        // retun proxy as string or object
        if(returnAs === 'string') return proxy.toString();
        else if(returnAs === 'object') return proxy.obj()
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    _shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    _handleReturnAsInput(proxyType=null){
        if(typeof proxyType === 'string'){
            proxyType = proxyType.toLowerCase();
            if(proxyType === 'str') proxyType = 'string';
            if(proxyType === 'obj') proxyType = 'object';
            if(proxyType !== 'string' && proxyType !== 'object'){
                console.error('proxyType must be either "string" or "object"');
                proxyType = null
            }
            return proxyType;
        }else
            return null;
    }
    
    _parseFile(filename) {
        // read file
        let str = fs.readFileSync(filename, 'utf8');
        // this function is able to handle multiples types of files
        let strList = str.split('\n')
        // remove lines that are empty
        strList = strList.filter(s=>s.length>0);
        // if strList is has only one element
        if(strList.length === 1)
            strList = str.split(' ')
        // if strList is has only one check to separate by comma
        if(strList.length === 1)
            strList = str.split(',')
        // remove all the commas from the strings
        strList = strList.map(s=>s.replace(',',''))
        // parse list of strings into 
        strList = strList
            .map(s=>s.trim())
            .filter(s=>s.length>0);
        // return proxies
        return strList;
    }


    _isArray(arrayValue){
        return ( arrayValue && 
            (typeof arrayValue === 'object') && 
            (arrayValue.constructor === Array) );
    }

    _resurection(){
        // look for proxies that have been 
        // dead for a long than the resurection time
        // and revive them
        for( let proxy of this.graveyard )
            if( proxy.isDead() && proxy.timeSinceStatusChange >= this.revive_timer )
                this.resurect(proxy);
    }

    async test_proxies(){
        // test if proxies are working
        let proxies = this.pool.toArray()
            .map(p=>p.proxy)
            .map(p=> ({
                host:p.split(':')[0],
                port:p.split(':')[1]
            }));
        console.log('--- Testing Proxies ---');
        let workingCount = 0;
        let notWorkingCount = 0;
        // make request with proxy
        for (const proxy of proxies) {
            console.log(`Testing proxy ${proxy.host}:${proxy.port}...`);    
            const response = await makeRequestWithProxy(proxy);
            if (response === proxy.host) {
                console.log(`Proxy ${proxy.host}:${proxy.port} is working.`);
                workingCount++;
            } else {
                console.log(`Proxy ${proxy.host}:${proxy.port} is not working.`);
                notWorkingCount++;
            }
        }
        console.log('--- Statistics ---');
        console.log(`Total proxies: ${proxies.length}`);
        console.log(`Working proxies: ${workingCount}`);
        console.log(`Not working proxies: ${notWorkingCount}`);
    }

    test = this.test_proxies;

}

export default ProxyRotator 
