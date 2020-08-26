function test(input: string, windowSize = 20, minSize = 3) {
  console.log('input length:', input.length)
  console.log('input:', input)
  const encoded = encode(input, windowSize, minSize)
  const encondedString = encoded.map(block => `${block.buffer ? block.buffer : `(${block.pointer.offset.toString()},${block.pointer.length})`}`).join('')
  console.log('encoded:', encondedString)
  console.log('encoded length:', encondedString.length)
  const decoded = decode(encoded)
  console.log('decoded', decoded)
}

function main() {
  test('AABCBBABC')
}

if (require.main === module) {
  main()
}

export interface Block {
  pointer: {
    offset: number,
    length: number,
  },
  buffer?: string
}

function computePointer(searchBuffer: string, lookAheadBuffer: string, minSize: number): { offset: number, length: number } {
  const N = lookAheadBuffer.length;
  for (let i = N; i >= minSize; i--) {
    const search = lookAheadBuffer.substring(0, i)
    const searchedIndex = searchBuffer.indexOf(search)
    if (searchedIndex > 0) {
      return {
        offset: searchBuffer.length - searchedIndex,
        length: search.length
      }
    }
  }

  return { offset: 0, length: 0 }
}

export function encode(input: string, windowSize: number, minSize: number): Block[] {
  let codingPosition = 0
  const blocks: Block[] = []
  while (codingPosition < input.length) {
    const searchBuffer = input.substring(Math.max(0, codingPosition - windowSize), codingPosition)
    const lookAheadBuffer = input.substring(codingPosition, input.length)
    const pointer = computePointer(searchBuffer, lookAheadBuffer, minSize)
    if (pointer.length === 0) {
      blocks.push({ pointer, buffer: lookAheadBuffer.charAt(0) })
      codingPosition += 1
    } else {
      blocks.push({ pointer })
      codingPosition += pointer.length
    }
  }

  return blocks
}

export function decode(blocks: Block[]) {
  let result = ''
  blocks.forEach(block => {
    const buffer = block.buffer
    if (buffer) {
      result += block.buffer
    } else {
      const offset = result.length - block.pointer.offset
      result += result.slice(offset, offset + block.pointer.length)
    }
  })
  return result
}