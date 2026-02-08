const stringify = (value) => {
  if (value === null) {
    return 'null'
  }

  if (typeof value === 'object') {
    return '[complex value]'
  }

  if (typeof value === 'string') {
    return `'${value}'`
  }

  return String(value)
}

const buildPlain = (diff, path = '') => {
  const lines = diff.map((item) => {
    const currentPath = path ? `${path}.${item.key}` : item.key

    switch (item.status) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${stringify(item.value)}`

      case 'removed':
        return `Property '${currentPath}' was removed`

      case 'changed': {
        const oldValue = stringify(item.oldValue)
        const newValue = stringify(item.newValue)
        return `Property '${currentPath}' was updated. From ${oldValue} to ${newValue}`
      }

      case 'nested':
        return buildPlain(item.children, currentPath)

      case 'unchanged':
        return null

      default:
        return null
    }
  })

  return lines.filter(line => line !== null).join('\n')
}

export default function formatPlain(diff) {
  return buildPlain(diff)
}
