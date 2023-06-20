class Queue {
    constructor() {
        this.items = {}
        this.frontIndex = 0
        this.backIndex = 0
    }
    
    enqueue(items){
        if(this._isArray(items)) // if passed an array
            for(let item of items) this._enqueue(item);
        else // single file
            this._enqueue(items);
    }

    _enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
        return item + ' inserted'
    }

    get dequeue() {
        const item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        return item
    }

    get peek() {
        return this.items[this.frontIndex]
    }

    get printQueue() {
        return this.items;
    }

    // return array of items in the order they were added
    get array() {
        let arr = [];
        for(let i = this.frontIndex; i < this.backIndex; i++)
            arr.push(this.items[i]);
        return arr;
    }

    _isArray(arrayValue){
        return ( arrayValue && 
            (typeof arrayValue === 'object') && 
            (arrayValue.constructor === Array) );
    }
}

export default Queue;
