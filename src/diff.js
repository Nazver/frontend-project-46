export default function diff(file1, file2) {
  const allKeys = new Set([...Object.keys(file1), ...Object.keys(file2)])
  const result = []
  const sortedKeys = Array.from(allKeys).sort()

  for (const key of sortedKeys) {
    const value1 = file1[key]
    const value2 = file2[key]

    if (!(key in file1) && key in file2) {
      result.push({ key, status: 'added', value: value2 })
    }
    else if (key in file1 && !(key in file2)) {
      result.push({ key, status: 'removed', value: value1 })
    }
    else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
      result.push({ key, status: 'changed', oldValue: value1, newValue: value2 })
    }
    else {
      result.push({ key, status: 'unchanged', value: value1 })
    }
  }
  return result
}
