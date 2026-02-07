/* eslint-disable */
import formatDiff from '../src/formatDiff.js'
import diff from '../src/diff.js'

describe('diff', () => {
  test('added key', () => {
    const file1 = { name: 'John' }
    const file2 = { name: 'John', age: 30 }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'age', status: 'added', value: 30 },
      { key: 'name', status: 'unchanged', value: 'John' },
    ])
  })

  test('removed key', () => {
    const file1 = { name: 'John', age: 30 }
    const file2 = { name: 'John' }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'age', status: 'removed', value: 30 },
      { key: 'name', status: 'unchanged', value: 'John' },
    ])
  })

  test('changed value', () => {
    const file1 = { name: 'John', age: 30 }
    const file2 = { name: 'John', age: 31 }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'age', status: 'changed', oldValue: 30, newValue: 31 },
      { key: 'name', status: 'unchanged', value: 'John' },
    ])
  })

  test('unchanged value', () => {
    const file1 = { name: 'John', age: 30 }
    const file2 = { name: 'John', age: 30 }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'age', status: 'unchanged', value: 30 },
      { key: 'name', status: 'unchanged', value: 'John' },
    ])
  })

  test('all statuses together', () => {
    const file1 = {
      unchanged: 'same',
      removed: 'deleted',
      changed: 'old',
    }

    const file2 = {
      unchanged: 'same',
      changed: 'new',
      added: 'new key',
    }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'added', status: 'added', value: 'new key' },
      { key: 'changed', status: 'changed', oldValue: 'old', newValue: 'new' },
      { key: 'removed', status: 'removed', value: 'deleted' },
      { key: 'unchanged', status: 'unchanged', value: 'same' },
    ])
  })

  test('keys are sorted', () => {
    const file1 = { z: 1, a: 2, m: 3 }
    const file2 = { z: 1, a: 2, m: 3 }

    const result = diff(file1, file2)
    const keys = result.map(item => item.key)

    expect(keys).toEqual(['a', 'm', 'z'])
  })

  test('empty objects', () => {
    const result = diff({}, {})
    expect(result).toEqual([])
  })

  test('first object empty', () => {
    const result = diff({}, { a: 1 })
    expect(result).toEqual([{ key: 'a', status: 'added', value: 1 }])
  })

  test('second object empty', () => {
    const result = diff({ a: 1 }, {})
    expect(result).toEqual([{ key: 'a', status: 'removed', value: 1 }])
  })

  test('different value types', () => {
    const file1 = {
      bool: true,
      nullVal: null,
      num: 42,
    }

    const file2 = {
      bool: false,
      nullVal: null,
      num: 42,
    }

    const result = diff(file1, file2)

    expect(result).toEqual([
      { key: 'bool', status: 'changed', oldValue: true, newValue: false },
      { key: 'nullVal', status: 'unchanged', value: null },
      { key: 'num', status: 'unchanged', value: 42 },
    ])
  })
})

describe('formatDiff', () => {
  test('added status', () => {
    const diffArray = [{ key: 'age', status: 'added', value: 30 }]
    const result = formatDiff(diffArray)

    expect(result).toBe(`{
  + age: 30
}`)
  })

  test('removed status', () => {
    const diffArray = [{ key: 'age', status: 'removed', value: 30 }]
    const result = formatDiff(diffArray)

    expect(result).toBe(`{
  - age: 30
}`)
  })

  test('changed status', () => {
    const diffArray = [{
      key: 'age',
      status: 'changed',
      oldValue: 30,
      newValue: 31,
    }]

    const result = formatDiff(diffArray)

    expect(result).toBe(`{
  - age: 30
  + age: 31
}`)
  })

  test('unchanged status', () => {
    const diffArray = [{ key: 'name', status: 'unchanged', value: 'John' }]
    const result = formatDiff(diffArray)

    expect(result).toBe(`{
    name: John
}`)
  })

  test('all statuses', () => {
    const diffArray = [
      { key: 'unchanged', status: 'unchanged', value: 'value1' },
      { key: 'removed', status: 'removed', value: 'value2' },
      { key: 'added', status: 'added', value: 'value3' },
      { key: 'changed', status: 'changed', oldValue: 'old', newValue: 'new' },
    ]

    const result = formatDiff(diffArray)

    const expected = `{
    unchanged: value1
  - removed: value2
  + added: value3
  - changed: old
  + changed: new
}`

    expect(result).toBe(expected)
  })

  test('different value types', () => {
    const diffArray = [
      { key: 'string', status: 'unchanged', value: 'text' },
      { key: 'number', status: 'unchanged', value: 123 },
      { key: 'boolean', status: 'unchanged', value: true },
      { key: 'null', status: 'unchanged', value: null },
      { key: 'undefined', status: 'unchanged', value: undefined },
    ]

    const result = formatDiff(diffArray)

    expect(result).toBe(`{
    string: text
    number: 123
    boolean: true
    null: null
    undefined: undefined
}`)
  })

  test('special characters in keys', () => {
    const diffArray = [
      { key: 'key-with-dash', status: 'unchanged', value: 'value' },
      { key: 'key.with.dot', status: 'unchanged', value: 'value' },
      { key: 'key with spaces', status: 'unchanged', value: 'value' },
    ]

    const result = formatDiff(diffArray)

    expect(result).toContain('key-with-dash: value')
    expect(result).toContain('key.with.dot: value')
    expect(result).toContain('key with spaces: value')
  })

  test('long values', () => {
    const longText = 'a'.repeat(100)
    const diffArray = [
      { key: 'long', status: 'unchanged', value: longText },
    ]

    const result = formatDiff(diffArray)

    expect(result).toBe(`{
    long: ${longText}
}`)
  })

  test('order is preserved', () => {
    const diffArray = [
      { key: 'z', status: 'unchanged', value: 1 },
      { key: 'a', status: 'unchanged', value: 2 },
    ]

    const result = formatDiff(diffArray)

    const lines = result.split('\n')
    expect(lines[1]).toContain('z: 1')
    expect(lines[2]).toContain('a: 2')
  })
})
