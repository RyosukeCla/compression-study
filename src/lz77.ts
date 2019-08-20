function test(input: string, windowSize = 20) {
  console.log('input:', input)
  const encoded = encode(input, windowSize)
  console.log('encoded:', encoded)
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

function computePointer(searchBuffer: string, lookAheadBuffer: string): { offset: number, length: number } {
  let search = ''
  let pointer: { offset: number, length: number } = { offset: 0, length: 0 }
  const N = lookAheadBuffer.length
  for (let i = 0; i < N; i++) {
    search += lookAheadBuffer[i]
    const searchedIndex = searchBuffer.indexOf(search)
    if (searchedIndex === -1 && i === 0) {
      break
    } else if (searchedIndex !== -1) {
      pointer = {
        offset: searchBuffer.length - searchedIndex,
        length: search.length
      }
    } else {
      return pointer
    }
  }

  return pointer
}

export function encode(input: string, windowSize: number): Block[] {
  let codingPosition = 0
  let searchBuffer: string
  let lookAheadBuffer: string
  const blocks: Block[] = []
  while (codingPosition < input.length) {
    searchBuffer = input.substring(Math.max(0, codingPosition - windowSize), codingPosition)
    lookAheadBuffer = input.substring(codingPosition, input.length)
    const pointer = computePointer(searchBuffer, lookAheadBuffer)
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