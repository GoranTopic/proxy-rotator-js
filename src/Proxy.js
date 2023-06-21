class Proxy {
    constructor(proxy, protocol = null) {
        // if proxy string starts with protocol
        if( proxy.includes('://') ){
            this.protocol = proxy.split('://')[0];
            this.ip = proxy.split('://')[1].split(':')[0];
            this.port = proxy.split('://')[1].split(':')[1];
        } else { // if proxy string does not start with protocol
            this.protocol = protocol;
            this.ip = proxy.split(':')[0];
            this.port = proxy.split(':')[1];
        }
        // the proxy 
        this.proxy = `${(this.protocol)? this.protocol+'://' : ''}${this.ip}:${this.port}`;
        // status can be 'new', 'alive', 'dead'
        this.status = 'new';
        this.changeTimeStamp = Date.now();
    }
    // method to return as string
    proxy() {
        return `${(this.protocol)? this.protocol+'://' : ''}${this.ip}:${this.port}`;
    }
    toString() {
        return `${(this.protocol)? this.protocol+'://' : ''}${this.ip}:${this.port}`;
    }
    // method to return as obj
    get() {
        return {
            protocol: this.protocol,
            ip: this.ip,
            port: this.port,
        };
    }
    // method to return as obj
    obj() {
        return {
            protocol: this.protocol,
            ip: this.ip,
            port: this.port,
            status: this.status,
            changeTimeStamp: this.changeTimeStamp
        }
    }
    // mark proxy as dead
    kill() {
        this.status = 'dead';
        this.changeTimeStamp = Date.now();
    }
    setDead() {
        this.status = 'dead'
        this.changeTimeStamp = Date.now();
    }
    setAlive(){
        this.status = 'alive'
        this.changeTimeStamp = Date.now();
    }
    setNew() { 
        this.status = 'new'
        this.changeTimeStamp = Date.now();
    }
    isDead() { 
        return this.status === 'dead';
    }
    isAlive() {
        return this.status === 'alive';
    }
    isNew() {
        return this.status === 'new';
    }
    revive() {
        this.status = 'alive';
        this.changeTimeStamp = Date.now();
    }
    reset() {
        this.status = 'new';
        this.changeTimeStamp = Date.now();
    }
    status() {
        return this.status;
    }
    equals(proxy) {
        if (typeof proxy === 'string')
            proxy = new Proxy(proxy);
        return (this.ip === proxy.ip && this.port === proxy.port);      
    }
    timeSinceStatusChange() {
        return Date.now() - this.changeTimeStamp;
    }
    print() {
        console.log(this.get());
    }
    getIp() {
        return this.ip;
    }
    getPort() {
        return this.port;
    }
    getProtocol() {
        return this.protocol;
    }
}

export default Proxy;
