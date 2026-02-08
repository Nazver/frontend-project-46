import * as fs from 'node:fs'
import * as path from 'node:path'
import yaml from 'js-yaml'

const parsers = {
  '.json': content => JSON.parse(content),
  '.yaml': content => yaml.load(content),
  '.yml': content => yaml.load(content),
}

export default function parseFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const ext = path.extname(filePath).toLowerCase()

  const parser = parsers[ext]
  if (!parser) {
    const supportedFormats = Object.keys(parsers).join(', ')
    throw new Error(`Unsupported file format: ${ext}. Supported formats: ${supportedFormats}`)
  }

  return parser(content)
}
