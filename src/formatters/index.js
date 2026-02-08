import formatStylish from './stylish.js'
import formatPlain from './plain.js'
import formatJson from './json.js'

const formatters = {
  stylish: formatStylish,
  plain: formatPlain,
  json: formatJson,
}

export default function getFormatter(format) {
  const formatter = formatters[format]
  if (!formatter) {
    const supportedFormats = Object.keys(formatters).join(', ')
    throw new Error(`Unsupported format: ${format}. Supported formats: ${supportedFormats}`)
  }
  return formatter
}

export { formatStylish, formatPlain, formatJson }
