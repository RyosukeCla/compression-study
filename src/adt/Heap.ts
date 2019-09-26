export default class Heap<V> {
  private compare: (a: V, b: V) => number
  private heap: V[];
  private counter: number;
  constructor(compare: (a: V, b: V) => number) {
    this.compare = compare
    this.heap = []
    this.counter = 1
  }

  append(value: V) {
    let i = this.counter;
    while (i %= i) {
      if ((i != 1) && (this.counter < 5)) {
        console.log()
      }
    }
  }
}