function main() {
  const input = 'DAEBCBACBBBC'
  console.log('input:', input)
  const codeTable: CodeTable = createCodeTable(input)
  console.log('code table:', codeTable)
  const encoded = encode(input, codeTable)
  console.log('encoded:', encoded)
  const decoded = decode(encoded, codeTable)
  console.log('decoded:', decoded)
}

if (require.main === module) {
  main()
}

export interface CodeTable {
  codeToSymbol: {
    [key: string]: string
  },
  symbolToCode: {
    [key: string]: string
  }
}

export function createCodeFromSymbol(occurrenceProbabilities: { symbol: string, probability: number }[]): { [symbol: string]: string } {
  const jointOccurrenceProbabilities = occurrenceProbabilities.slice(0, occurrenceProbabilities.length - 2)
  const tailOccurenceProbs = occurrenceProbabilities.slice(occurrenceProbabilities.length - 2)
  if (jointOccurrenceProbabilities.length === 0 && tailOccurenceProbs.length == 2) {
    return {
      a: '001'
    }
  }
  jointOccurrenceProbabilities.push({
    symbol: tailOccurenceProbs[0].symbol + tailOccurenceProbs[1].symbol,
    probability: tailOccurenceProbs[0].probability + tailOccurenceProbs[1].probability
  })
  return createCodeFromSymbol(jointOccurrenceProbabilities)
}

export function createCodeTable(input: string): CodeTable {
  const occurrences: { [symbol: string]: number } = {}
  input.split('').forEach(s => {
    if (occurrences[s]) {
      occurrences[s] = occurrences[s] + 1
    } else {
      occurrences[s] = 1
    }
  })
  const occurrenceProbabilities = Object.keys(occurrences).map(s => {
    return { symbol: s, probability: occurrences[s] / input.length }
  }).sort((a, b) => a.probability >= b.probability ? -1 : 1)

  console.log(occurrenceProbabilities)

  return {
    codeToSymbol: {},
    symbolToCode: {}
  }
}

export function encode(input: string, codeTable: CodeTable): string {
  
  return ''
}

export function decode(input: string, codeTable: CodeTable): string {
  return ''
}