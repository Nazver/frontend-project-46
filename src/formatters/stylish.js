const stringify = (value, depth = 1) => {
  const indentSize = 4
  const currentIndent = ' '.repeat(indentSize * depth)
  const bracketIndent = ' '.repeat(indentSize * (depth - 1))

  if (typeof value !== 'object' || value === null) {
    return String(value)
  }

  const entries = Object.entries(value)
  const lines = entries.map(([key, val]) => {
    const formattedValue = stringify(val, depth + 1)
    return `${currentIndent}${key}: ${formattedValue}`
  })

  return `{\n${lines.join('\n')}\n${bracketIndent}}`
}

const formatStylish = (diffArray, depth = 1) => {
  const indentSize = 4
  const currentIndent = ' '.repeat(indentSize * depth - 2)
  const bracketIndent = ' '.repeat(indentSize * (depth - 1))

  const lines = diffArray.map((item) => {
    switch (item.status) {
      case 'added':
        return `${currentIndent}+ ${item.key}: ${stringify(item.value, depth + 1)}`

      case 'removed':
        return `${currentIndent}- ${item.key}: ${stringify(item.value, depth + 1)}`

      case 'changed': {
        const oldValue = stringify(item.oldValue, depth + 1)
        const newValue = stringify(item.newValue, depth + 1)
        return `${currentIndent}- ${item.key}: ${oldValue}\n${currentIndent}+ ${item.key}: ${newValue}`
      }

      case 'unchanged':
        return `${currentIndent}  ${item.key}: ${stringify(item.value, depth + 1)}`

      case 'nested':
        return `${currentIndent}  ${item.key}: ${formatStylish(item.children, depth + 1)}`

      default:
        return ''
    }
  })

  return `{\n${lines.join('\n')}\n${bracketIndent}}`
}

export default formatStylish
