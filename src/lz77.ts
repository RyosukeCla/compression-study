import fs from 'fs';
import path from 'path';
function main() {
  const input = fs.readFileSync(path.resolve(__dirname, './test.txt')).toString();
  const startTime = Date.now();
  const encodedBlocks = encode(input, { windowSize: 999, minWindowSize: 5 });
  const encodedString = toString(encodedBlocks);
  const encodedTime = Date.now();
  const decoded = decode(parseToBlocks(encodedString));
  const decodedTime = Date.now();
  console.log('encode time:', encodedTime - startTime);
  console.log('decode time:', decodedTime - encodedTime);
  console.log('assert input === decoded:', input === decoded);
  console.log('input size:', input.length);
  console.log('encode size:', encodedString.length);
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

function toString(blocks: Block[]): string {
  const res: (string | number[])[] = []
  let buffer = ''
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (block.buffer) {
      buffer += block.buffer;
    } else {
      if (buffer) {
        res.push(buffer);
        buffer = ''
      }
      res.push([block.pointer.offset,block.pointer.length])
    }
  }
  if (buffer) {
    res.push(buffer);
  }
  return JSON.stringify(res);
}

function parseToBlocks(str: string): Block[] {
  const parsed: (string | number[])[] = JSON.parse(str);
  return parsed.map(block => {
    if (typeof block === 'string') {
      return {
        buffer: block
      } as Block
    } else {
      return {
        pointer: {
          offset: block[0],
          length: block[1]
        }
      } as Block
    }
  })
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