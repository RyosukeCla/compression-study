
function main() {
  const input = 'DAEBCBACBBBC'
  console.log('input:', input)
  const codeTable = createCodeTable(input)
  console.log('code table:', codeTable)
  const encoded = encode(input, codeTable)
  console.log('encoded:', encoded)
  const decoded = decode(encoded, codeTable)
  console.log('decoded:', decoded)
}
main()

interface CodeTable {
  symbolToCode: { [symbol: string]: string },
  codeToSymbol: { [code: string]: string },
  maxDigits: number
}

function createCode(digits: number, maxDigits: number): string {
  if (digits === 1) return '0'
  else if (digits === maxDigits) {
    let code = ''
    for (let i = 1; i < maxDigits; i++) {
      code += '1'
    }
    return code
  } else {
    let code = ''
    for (let i = 1; i < digits; i++) {
      code += '1'
    }
    code += '0'
    return code
  }
}

export function createCodeTable(input: string): CodeTable {
  const frequencyMap: Map<string, number> = new Map()
  input.split('').forEach(char => {
    const count = frequencyMap.get(char)
    if (count) {
      frequencyMap.set(char, count + 1)
    } else {
      frequencyMap.set(char, 1)
    }
  })
  const frequencyTable: { symbol: string, frequency: number }[] = []
  for (const [symbol, frequency] of frequencyMap.entries()) {
    frequencyTable.push({ symbol, frequency })
  }
  frequencyTable.sort((a, b) => b.frequency - a.frequency)
  
  const table: { symbol: string, code: string }[] = []
  for (let i = 0; i < frequencyTable.length; i++) {
    table.push({ symbol: frequencyTable[i].symbol, code: createCode(i + 1, frequencyTable.length) })
  }

  const symbolToCode: { [symbol: string]: string } = {}
  const codeToSymbol: { [code: string]: string } = {}
  for (const item of table) {
    symbolToCode[item.symbol] = item.code
    codeToSymbol[item.code] = item.symbol
  }
  return {
    symbolToCode,
    codeToSymbol,
    maxDigits: table.length - 1
  }
}

export function encode(input: string, table: CodeTable): string {
  const charArray = input.split('')
  return charArray.map(char => table.symbolToCode[char]).join('')
}

export function decode(input: string, table: CodeTable): string {
  let substr = ''
  let output = ''
  for (let i = 0; i < input.length; i++) {
    substr += input[i]
    if (input[i] === '0') {
      output += table.codeToSymbol[substr]
      substr = ''
    } else if (substr.length === table.maxDigits) {
      output += table.codeToSymbol[substr]
      substr = ''
    }
  }
  return output
}
