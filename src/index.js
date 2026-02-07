import diff from './diff.js'
import formatDiff from './formatDiff.js'
import * as fs from 'node:fs'
export default function index(filePath1, filePath2) {
  const filedata1 = JSON.parse(fs.readFileSync(filePath1, 'utf8'))
  const filedata2 = JSON.parse(fs.readFileSync(filePath2, 'utf8'))
  const diffResult = diff(filedata1, filedata2)
  return formatDiff(diffResult)
}
