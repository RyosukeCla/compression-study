
interface Vertex<VM> {
  _id: string,
  meta: VM
}

interface Edge<EM> {
  _id: string
  meta: EM
}

function generateId() {
  const literals = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  let res = ''
  for (let i = 0; i < 16; i++) {
    res += literals.charAt(Math.trunc(Math.random() * literals.length))
  }
  return res
}

interface Graph<VM, EM> {
  addVertex(vertexMeta: VM): Vertex<VM>,
  addEdge(tail: Vertex<VM>, head: Vertex<VM>, edgeMeta: EM): Edge<EM>,
  getHeads(tail: Vertex<VM>): Vertex<VM>[],
  getEdge(tail: Vertex<VM>, head: Vertex<VM>): Edge<EM> | undefined
}

class Graph<VM, EM> implements Graph<VM, EM> {
  private edges: Map<string, Map<string, Edge<EM>>>
  private vertices: Map<string, Vertex<VM>>

  constructor() {
    this.edges = new Map()
    this.vertices = new Map()
  }

  addVertex(vertexMeta: VM): Vertex<VM> {
    const vertex: Vertex<VM> = {
      _id: generateId(),
      meta: {
        ...vertexMeta
      }
    }
    Object.freeze(vertex)
    this.vertices.set(vertex._id, vertex)
    return vertex
  }

  addEdge(tail: Vertex<VM>, head: Vertex<VM>, edgeMeta: EM): Edge<EM> {
    const edge: Edge<EM> = {
      _id: generateId(),
      meta: {
        ...edgeMeta
      }
    }
    Object.freeze(edge)

    const edgesFromTail: Map<string, Edge<EM>> = this.edges.get(tail._id) || new Map()
    edgesFromTail.set(head._id, edge)
    this.edges.set(tail._id, edgesFromTail)

    return edge
  }

  getHeads(tail: Vertex<VM>): Vertex<VM>[] {
    const heads = this.edges.get(tail._id)
    if (!heads) return []
    const tails = Array.from(heads.keys()).map(id => this.vertices.get(id))
    return tails as Vertex<VM>[]
  }

  getEdge(tail: Vertex<VM>, head: Vertex<VM>): Edge<EM> | undefined {
    const edges = this.edges.get(tail._id)
    if (!edges) return undefined
    return edges.get(head._id)
  }

  getVertices(): Vertex<VM>[] {
    return Array.from(this.vertices.values())
  }
}

export function search<VM>(source: Vertex<VM>, sink: Vertex<VM>, graph: Graph<VM, { length: number }>) {
  const distV = new Map<string, number>()
  const prevV = new Map<string, Vertex<VM>>()
  const queue: Vertex<VM>[] = []
  graph.getVertices().forEach(vertex => {
    if (source._id === vertex._id) {
      distV.set(vertex._id, 0)
    } else {
      distV.set(vertex._id, 9999999999999)
    }
    queue.push(vertex)
  })

  const findMinimulDistVertexIndex = (vertices: Vertex<VM>[]): number => {
    let index = 0
    vertices.forEach((vertex, i) => {
      const dist = distV.get(vertex._id)
      if (dist === undefined) throw new Error('no dist')
      const minimulDist = distV.get(vertices[index]._id)
      if (minimulDist === undefined) throw new Error('no mdist')
      if (dist < minimulDist) {
        index = i
      }
    })
    return index
  }

  search: while (queue.length > 0) {
    const minimulDistVertexIndex = findMinimulDistVertexIndex(queue)
    const minimulDistVertex = queue.splice(minimulDistVertexIndex, 1)[0]
    const mdist = distV.get(minimulDistVertex._id)
    if (mdist === undefined) throw new Error('no mdi')
    const heads = graph.getHeads(minimulDistVertex)
    for (const head of heads) {
      const dist = distV.get(head._id)
      if (dist === undefined) throw new Error('no di')
      const edge = graph.getEdge(minimulDistVertex, head)
      if (!edge) throw new Error('no edge')
      const length = edge.meta.length
      if (dist > mdist + length) {
        distV.set(head._id, mdist + length)
        prevV.set(head._id, minimulDistVertex)
        if (head._id === sink._id) break search
      }
    }
  }

  let shortestPath: Vertex<VM>[] = []
  let prev = sink
  while (!!prevV.get(prev._id)) {
    shortestPath.unshift(prev)
    prev = prevV.get(prev._id) as Vertex<VM>
    prevV.delete(sink._id)
  }
  shortestPath.unshift(prev)
  return shortestPath
}

function main() {
  const graph = new Graph<{ label: string }, { length: number }>()
  const a = graph.addVertex({ label: 'a' })
  const b = graph.addVertex({ label: 'b' })
  const c = graph.addVertex({ label: 'c' })
  const d = graph.addVertex({ label: 'd' })
  const e = graph.addVertex({ label: 'e' })
  graph.addEdge(a, b, { length: 1 })
  graph.addEdge(b, c, { length: 1 })
  graph.addEdge(c, d, { length: 1 })
  graph.addEdge(d, e, { length: 1 })
  graph.addEdge(a, c, { length: 1 })

  console.log('a:', a, 'e:', e)
  console.log('path', search(a, e, graph))
}

main()