const compareStrings = (a, b) =>
  String(a).localeCompare(String(b), 'en', {
    sensitivity: 'base',
    numeric: true,
  })

export default function diff(obj1, obj2) {
  const buildDiff = (data1, data2) => {
    const allKeys = new Set([...Object.keys(data1 || {}), ...Object.keys(data2 || {})])
    const sortedKeys = Array.from(allKeys).sort(compareStrings)

    return sortedKeys.map((key) => {
      const value1 = data1?.[key]
      const value2 = data2?.[key]
      const inObj1 = key in (data1 || {})
      const inObj2 = key in (data2 || {})

      if (!inObj1 && inObj2) {
        return {
          key,
          status: 'added',
          value: value2,
        }
      }

      if (inObj1 && !inObj2) {
        return {
          key,
          status: 'removed',
          value: value1,
        }
      }

      const isObject1 = typeof value1 === 'object' && value1 !== null && !Array.isArray(value1)
      const isObject2 = typeof value2 === 'object' && value2 !== null && !Array.isArray(value2)

      if (isObject1 && isObject2) {
        return {
          key,
          status: 'nested',
          children: buildDiff(value1, value2),
        }
      }

      if (JSON.stringify(value1) === JSON.stringify(value2)) {
        return {
          key,
          status: 'unchanged',
          value: value1,
        }
      }

      return {
        key,
        status: 'changed',
        oldValue: value1,
        newValue: value2,
      }
    })
  }

  return buildDiff(obj1, obj2)
}
