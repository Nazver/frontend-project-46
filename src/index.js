import diff from './diff.js'
import formatDiff from './formatDiff.js'
import parseFile from './parsers.js'

const formatters = {
  stylish: formatDiff,
}

export default function gendiff(filePath1, filePath2, format = 'stylish') {
  const filedata1 = parseFile(filePath1)
  const filedata2 = parseFile(filePath2)
  const diffResult = diff(filedata1, filedata2)

  const formatter = formatters[format]
  if (!formatter) {
    throw new Error(`Unsupported format: ${format}. Supported formats: ${Object.keys(formatters).join(', ')}`)
  }

  return formatter(diffResult)
}
export { gendiff }
