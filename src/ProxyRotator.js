import fs from 'fs';
import Queue from './Queue.js';
import Proxy from './Proxy.js';

class ProxyRotator {
    constructor(proxies, options={} ){
        this.pool = new Queue();
        this.graveyard = new Queue();
        // examine proxies passed
        // check if it is a file path
        if( typeof proxies === 'string' ){
            // parse file
            proxies = this._parse_file(proxies);
            // add proxies to queue
            proxies.forEach( p => this._add(p) );
        }else if( this._isArray(proxies) ){
            // add proxies to queue
            proxies.forEach( p => this._add(p) );
        }
        // handle options
        let { switch_rate, use_rate, shuffle, protocol, assume_aliveness } = options;
        // 1000ms * 60s * 30m = 30m
        //this.timeout_rate = 1000 * 60 * 30;
        // get initial proxies
        //let initial_proxy_pool = this._shuffleArray();
        // add the new proxies to the queue
        //this.add_new_proxies(initial_proxy_pool);
    }

    get_pool_size(){ return this.pool.size }

    get_graveyard_size(){ return this.graveyard.size }

    get_pool () {
        return this.pool.toArray().map(p => p.proxy)
    }

    add(proxies){ // add proxy to queue
        if(this._isArray(proxies)) // if passed an array
            for(let proxy of proxies) this._add(proxy);
        else // single file
            this._add(proxies);
    }

    _add(proxy){ // add proxy to queue
        let p = new Proxy(proxy);
        this.pool.enqueue(p);
    }

    remove(proxy){ // remove proxy from queue
        if(this._isArray(proxy)) // if passed an array
            for(let p of proxy) this._remove(p);
        else // single file
            this._remove(proxy);
    }

    _remove(proxy){ // remove proxy from queue
        this.pool.remove(proxy);
    }

    find_proxy_by_str(str){
        // look for a single proxy with the str
        let proxy_pool = [ ...this.dead, ...this.queue ];
        return proxy_pool.filter( proxy => str === proxy )[0];
    }

    remove_proxy_from_all(str){
        // remove proxy from any list it is in
        this.queue = this.queue.filter( proxy => proxy.proxy !== str )
        this.dead = this.dead.filter( proxy => proxy.proxy !== str )
    }

    remove_proxy_from_queue(str){
        // remove proxy from queue
        this.dead = this.dead.filter( proxy => proxy.proxy !== str )
    }

    remove_proxy_from_dead(str){
        // remove proxy from any dead list
        this.queue = this.queue.filter( proxy => proxy.proxy !== str )
    }

    add_new_proxies(proxies){
        // with a list of proxies, add them to the queue
        proxies.forEach( proxy => 
            this.queue.push({
                status:'Unknown', 
                timeoutID: null,
                times_resurected: null,
                ip: proxy.split(':')[0],
                port: proxy.split(':')[1],
                proxy
            })
        )
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

    str_param_decorator = func => 
        function(proxy){
            // if it is passed a str insted of obj, 
            if( proxy instanceof String )
                // ge the proxy obj
                proxy = find_proxy_by_str( proxy );
            return func( proxy )
        }

    _parse_file(filename) {
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

    next = () => {
        if(this.queue.length === 0){
            // there are not proxies
            console.error("no proxies in queue");
            return null ;
        }
        // remove from front 
        let proxy = this.queue.shift();
        // add to back
        this.queue.push(proxy);
        // return 
        return proxy
    }

    getAlive = () => {
        if(this.queue.length === 0){
            // there are not proxies
            console.error("no proxies in queue");
            return null ;
        }
        let proxy = null;
        for(let i =0;i<this.queue.length;i++)
            if( this.queue[i].status === "Alive"){
                // get first Alive proxy
                proxy = this.queue.splice(i,1);
                // add it to the end
                this.queue.push(proxy);
                // stop loop
                i = this.queue.length;
            }
        return proxy;
    }

    setAlive = this.str_param_decorator( proxy =>  {
        // if it is dead 
        if(proxy.status === "Dead")
            // bring it back to life
            this.resurect_proxy(proxy, "Alive")
        // if it is unknown
        else if(proxy.status === "Unknown")
            proxy.status = "Alive";
    })

    setDead = this.str_param_decorator( proxy =>  {
        this.remove_proxy_from_queue(proxy.proxy);
        proxy.status = 'Dead';
        if(proxy.timeoutID){
            clearTimeout(proxy.timeoutID)
            proxy.timeoutID = setTimeout( 
                this.resurect_proxy(proxy), 
                this.timeout_rate * ( proxy.times_resurected ?? 1 )
            );
        }
        this.dead.push(proxy);
    })

    getList = () => [ ...this.queue, ...this.dead ] 

    getAliveList = () => this.queue

    resurect_proxy( proxy, status="Unknown" ){
        this.remove_proxy_from_dead(proxy.proxy);
        proxy.status = status;
        proxy.times_resurected += 1;
        proxy.timeoutID = null;
        this.queue.push(proxy);
    }

    _isArray(arrayValue){
        return ( arrayValue && 
            (typeof arrayValue === 'object') && 
            (arrayValue.constructor === Array) );
    }
}

export default ProxyRotator 
