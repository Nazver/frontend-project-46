import diff from './diff.js'
import getFormatter from './formatters/index.js'
import parseFile from './parsers.js'

export default function gendiff(filePath1, filePath2, format = 'stylish') {
  const filedata1 = parseFile(filePath1)
  const filedata2 = parseFile(filePath2)
  const diffResult = diff(filedata1, filedata2)

  const formatter = getFormatter(format)
  return formatter(diffResult)
}

export { gendiff }
