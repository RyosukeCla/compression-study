function circularShift(target: string[]) {
  const shifted = target.slice(0, target.length - 1);
  shifted.unshift(target[target.length - 1])
  return shifted
}

function sortCircularMatrix(matrix: string[][]) {
  return matrix.sort((a, b) => {
    return a.join('').localeCompare(b.join(''))
  })
}

function sortString(target: string[]) {
  return target.sort((a, b) => a.localeCompare(b))
}

function makeCircularMatrix(target: string[]) {
  const matrix: string[][] = []
  let tempCharArray: string[] = target;
  for (let i = 0; i < target.length; i++) {
    matrix.push(tempCharArray)
    tempCharArray = circularShift(tempCharArray)
  }
  return matrix
}

export function encode(target: string): { bwt: string, index: number } {
  const charArray = target.split('');
  const matrix: string[][] = makeCircularMatrix(charArray)

  const sortedMatrix = sortCircularMatrix(matrix)

  const bwt = sortedMatrix.map(a => a[target.length - 1]).join('')
  const sortedIndex = sortedMatrix.findIndex(a => a.join('') === target)

  return {
    bwt: bwt,
    index: sortedIndex
  }
}

export function decode({ bwt, index }: { bwt: string, index: number }): string {
  const charArray = bwt.split('')
  const sortedCharArray = sortString(charArray)

  const matrix: string[][] = []
  for (let i = 0; i < bwt.length; i++) {
    const vector = []
    for (let j = 0; j < bwt.length; j++) {
      if (j === 0) {
        vector.push(sortedCharArray[i])
      } else {
        vector.push('?')
      }
    }
    matrix.push(vector)
  }

  let tempMatrix: string[][] = matrix
  for (let i = 0; i < bwt.length; i++) {
    tempMatrix = tempMatrix.map((a, index) => {
      a[bwt.length - 1] = bwt[index]
      return a
    })

    for (let j = 0; j < bwt.length; j++) {
      tempMatrix[j] = circularShift(tempMatrix[j])
    }

    tempMatrix = sortCircularMatrix(tempMatrix)
  }

  return tempMatrix[index].join('')
}

function main() {
  const target = 'SIX.MIXED.PIXIES.SIFT.SIXTY.PIXIE.DUST.BOXES'
  const encoded = encode(target)
  console.log(encoded)
  const decoded = decode(encoded)
  console.log(decoded)
}

main()
