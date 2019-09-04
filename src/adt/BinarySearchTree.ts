export class Node<V> {
  private left?: Node<V>
  private right?: Node<V>
  readonly value: V
  constructor(value: V) {
    this.value = value
  }

  appendChild(node: Node<V>, compare: (a: V, b: V) => number) {
    const isRight = compare(this.value, node.value) > 0

    if (isRight) {
      if (this.right) this.right.appendChild(node, compare)
      else this.right = node
    } else {
      if (this.left) this.left.appendChild(node, compare)
      else this.left = node
    }
  }

  search(v: V, compare: (a: V, b: V) => number): Node<V> | undefined {
    const compared = compare(this.value, v)
    if (compared === 0) {
      return this
    } else if (compared > 0) {
      return this.right ? this.right.search(v, compare) : undefined
    } else {
      return this.left ? this.left.search(v, compare) : undefined
    }
  }
}

const defaultCompare = <V>(a: V, b: V) => {
  if (a === b) return 0
  else if (a > b) return 1
  else return -1
}

export class Tree<V> {
  private node?: Node<V>
  private compare: (a: V, b: V) => number
  constructor(compare: (a: V, b: V) => number = defaultCompare) {
    this.compare = compare
  }

  append(value: V) {
    if (this.node) {
      this.node.appendChild(new Node(value), this.compare)
    } else {
      this.node = new Node(value)
    }
  }

  search(v: V): V | undefined {
    if (this.node) {
      const matched = this.node.search(v, this.compare)
      return matched ? matched.value : undefined
    } else {
      return undefined
    }
  }

  delete(v: V): V | undefined {
    if (!this.node) return undefined
  }
}

function main() {
  const tree = new Tree<number>()
  tree.append(100)
  tree.append(200)
  tree.append(50)
  tree.append(1000)
  tree.append(2)

  console.log(tree)
  console.log(tree.search(2), tree.search(3))
}

if (require.main === module) {
  main()
}
