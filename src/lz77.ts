function main() {
  const input = 'ABCABCABCABC'
  const encodedBlocks = encode(input, { windowSize: 2000, minWindowSize: 5 });
  const encodedString = encodedBlocks.map(block => `${block.buffer ? block.buffer : `(${block.pointer.offset.toString()},${block.pointer.length})`}`).join('');
  const decoded = decode(encodedBlocks);
  console.log('input:', input);
  console.log('encode:', encodedBlocks);
  console.log('encode str:', encodedString);
  console.log('decode:', decoded);
  console.log('assert', input === decoded);
  console.log('input length:', input.length);
  console.log('encode str length:', encodedString.length);
  console.log('compression ratio:', encodedString.length / input.length);
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

function computePointer({ searchBuffer, lookAheadBuffer, minWindowSize = 0 }: { searchBuffer: string, lookAheadBuffer: string, minWindowSize?: number }): { offset: number, length: number } {
  const N = lookAheadBuffer.length;
  for (let i = N; i >= minWindowSize; i--) {
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

export function encode(input: string, { windowSize = 256, minWindowSize = 3 }: { windowSize?: number, minWindowSize?: number }): Block[] {
  let codingPosition = 0
  const blocks: Block[] = []
  while (codingPosition < input.length) {
    const searchBuffer = input.substring(Math.max(0, codingPosition - windowSize), codingPosition);
    const lookAheadBuffer = input.substring(codingPosition, codingPosition + windowSize);
    const pointer = computePointer({ searchBuffer, lookAheadBuffer, minWindowSize })
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