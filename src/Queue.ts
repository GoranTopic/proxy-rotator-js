export default class Queue<T> {
  private items: Record<number, T> = {};
  private frontIndex = 0;
  private backIndex = 0;

  enqueue(item: T): T {
    this.items[this.backIndex] = item;
    this.backIndex++;
    return item;
  }

  dequeue(): T {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  remove(index: number): T | 'Invalid index' {
    if (index < this.frontIndex || index >= this.backIndex) {
      return 'Invalid index';
    }
    const item = this.items[index];
    for (let i = index; i < this.backIndex; i++) {
      this.items[i] = this.items[i + 1];
    }
    delete this.items[this.backIndex - 1];
    this.backIndex--;
    return item;
  }

  /** Remove item at position (0 = first in queue). */
  removeAt(position: number): T | 'Invalid index' {
    if (position < 0 || position >= this.size) {
      return 'Invalid index';
    }
    return this.remove(this.frontIndex + position);
  }

  peek(): T {
    return this.items[this.frontIndex];
  }

  printQueue(): Record<number, T> {
    return this.items;
  }

  toArray(): T[] {
    const arr: T[] = [];
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      arr.push(this.items[i]);
    }
    return arr;
  }

  toObject(): Record<number, T> {
    const obj: Record<number, T> = {};
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      obj[i] = this.items[i];
    }
    return obj;
  }

  get size(): number {
    return this.backIndex - this.frontIndex;
  }
}
