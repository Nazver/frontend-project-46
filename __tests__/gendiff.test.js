import gendiff from '../src/index.js'
import diff from '../src/diff.js'
import formatStylish from '../src/formatters/stylish.js'
import formatPlain from '../src/formatters/plain.js'
import formatJson from '../src/formatters/json.js'
import getFormatter from '../src/formatters/index.js'
import fs from 'fs'

describe('diff function', () => {
  test('finds added key', () => {
    const result = diff({ a: 1 }, { a: 1, b: 2 })
    expect(result).toContainEqual({ key: 'b', status: 'added', value: 2 })
  })

  test('finds removed key', () => {
    const result = diff({ a: 1, b: 2 }, { a: 1 })
    expect(result).toContainEqual({ key: 'b', status: 'removed', value: 2 })
  })

  test('finds changed value', () => {
    const result = diff({ a: 1 }, { a: 2 })
    expect(result[0]).toMatchObject({ status: 'changed', oldValue: 1, newValue: 2 })
  })

  test('finds unchanged value', () => {
    const result = diff({ a: 1 }, { a: 1 })
    expect(result[0].status).toBe('unchanged')
  })

  test('handles nested objects', () => {
    const result = diff({ a: { b: 1 } }, { a: { b: 2 } })
    expect(result[0].status).toBe('nested')
    expect(result[0].children[0].status).toBe('changed')
  })

  test('handles empty objects', () => {
    expect(diff({}, {})).toEqual([])
  })
})

describe('formatters', () => {
  const sampleDiff = [
    { key: 'unchanged', status: 'unchanged', value: 'same' },
    { key: 'added', status: 'added', value: 'new' },
    { key: 'removed', status: 'removed', value: 'old' },
    { key: 'changed', status: 'changed', oldValue: 'old', newValue: 'new' }
  ]

  test('stylish format shows added', () => {
    const result = formatStylish([{ key: 'test', status: 'added', value: 123 }])
    expect(result).toContain('+ test: 123')
  })

  test('stylish format shows removed', () => {
    const result = formatStylish([{ key: 'test', status: 'removed', value: 123 }])
    expect(result).toContain('- test: 123')
  })

  test('plain format works', () => {
    const result = formatPlain(sampleDiff)
    expect(result).toContain("Property 'added' was added")
    expect(result).toContain("Property 'removed' was removed")
  })

  test('plain format handles complex values', () => {
    const result = formatPlain([{ key: 'obj', status: 'added', value: { a: 1 } }])
    expect(result).toContain('[complex value]')
  })

  test('json format returns valid json', () => {
    const result = formatJson(sampleDiff)
    const parsed = JSON.parse(result)
    expect(parsed).toEqual(sampleDiff)
  })

  test('empty diff in stylish', () => {
    expect(formatStylish([])).toContain('{')
  })

  test('empty diff in plain', () => {
    expect(formatPlain([])).toBe('')
  })
})


describe('getFormatter', () => {
  test('returns stylish formatter', () => {
    expect(getFormatter('stylish')).toBe(formatStylish)
  })

  test('returns plain formatter', () => {
    expect(getFormatter('plain')).toBe(formatPlain)
  })

  test('throws error for invalid format', () => {
    expect(() => getFormatter('invalid')).toThrow()
  })
})

describe('gendiff', () => {
  test('compares JSON files with stylish', () => {
    const result = gendiff('__fixtures__/file1.json', '__fixtures__/file2.json')
    expect(result).toContain('+ follow: false')
    expect(result).toContain('- setting2: 200')
  })

  test('compares JSON files with plain', () => {
    const result = gendiff('__fixtures__/file1.json', '__fixtures__/file2.json', 'plain')
    expect(result).toContain("Property 'common.follow' was added")
  })

  test('compares JSON files with json', () => {
    const result = gendiff('__fixtures__/file1.json', '__fixtures__/file2.json', 'json')
    expect(() => JSON.parse(result)).not.toThrow()
  })

  test('compares YAML files', () => {
    const result = gendiff('__fixtures__/file1.yml', '__fixtures__/file2.yml')
    expect(result).toContain('+ follow: false')
  })

  test('identical files show no changes', () => {
    const result = gendiff('__fixtures__/file1.json', '__fixtures__/file1.json')
    expect(result).not.toContain('+ ')
    expect(result).not.toContain('- ')
  })

  test('throws for unsupported format', () => {
    fs.writeFileSync('test.txt', 'text')
    expect(() => gendiff('test.txt', '__fixtures__/file1.json')).toThrow()
    fs.unlinkSync('test.txt')
  })
})