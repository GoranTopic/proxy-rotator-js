class Queue {
    constructor() {
        this.items = {}
        this.frontIndex = 0
        this.backIndex = 0
    }
    
    enqueue(item) {
        this.items[this.backIndex] = item
        this.backIndex++
        return item + ' inserted'
    }

    dequeue() {
        const item = this.items[this.frontIndex]
        delete this.items[this.frontIndex]
        this.frontIndex++
        return item
    }
    
    // remove value while maintaining order
    remove( index ) {
        if (index < 0 || index >= this.backIndex) {
            return 'Invalid index'
        }
        const item = this.items[index]
        for (let i = index; i < this.backIndex; i++) {
            this.items[i] = this.items[i + 1]
        }
        delete this.items[this.backIndex - 1]
        this.backIndex--
        return item
    }

    peek() {
        return this.items[this.frontIndex]
    }

    printQueue() {
        return this.items;
    }

    // return array of items in the order they were added
    toArray() {
        let arr = [];
        for(let i = this.frontIndex; i < this.backIndex; i++)
            arr.push(this.items[i]);
        return arr;
    }

    // return object of items in the order they were added
    toObject() {
        let obj = {};
        for(let i = this.frontIndex; i < this.backIndex; i++)
            obj[i] = this.items[i];
        return obj;
    }
    
}

export default Queue;
