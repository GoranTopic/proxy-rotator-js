import fs from 'fs';
import Queue from './Queue.js';
import Proxy from './Proxy.js';

class ProxyRotator {
    constructor(proxies, options={} ){
        // examine proxies passed
        // check if it is a file path
        if( typeof proxies === 'string' ){
            // read file
            let file = fs.readFileSync(proxies, 'utf8');
            // split by new line or space
            proxies = file.split('\n').map(p=>p.trim()).filter(p=>p.length>0);
            // make a proxy for each proxy
            // if it starts with a protocol
            proxies = proxies.map( proxy => new Proxy(proxy) );
            proxies = proxies.map( proxy => proxy.get() );
            console.log(proxies);
        }
        // handle options
        let { switch_rate, use_rate, shuffle, protocol, assume_aliveness } = options;
        /*
        this.pool = new Queue();
        this.dead = new Queue();
        // 1000ms * 60s * 30m = 30m
        this.timeout_rate = 1000 * 60 * 30;
        // get initial proxies
        let initial_proxy_pool = this.shuffleArray(
            [ ...get_premium_proxies() ]
        );
        // add the new proxies to the queue
        this.add_new_proxies(initial_proxy_pool);
        */
    }

    add(proxies){ // add proxy to queue
        let p = new Proxy(proxy);
        this.pool.enqueue(p);
    }

    _
if(this._isArray(items)) // if passed an array
            for(let item of items) this._enqueue(item);
        else // single file
            this._enqueue(items);
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

    async getOnlineFreeProxies() {
        // scrap online free proxies
        let new_proxies = await get_free_online_proxies();
        this.add_new_proxies(new_proxies);
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
}

export default ProxyRotator 
