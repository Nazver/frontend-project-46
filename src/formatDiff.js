export default function formatDiff(diffArray) {
  const lines = [];

  diffArray.forEach((item) => {
    switch (item.status) {
      case 'added':
        lines.push(`  + ${item.key}: ${item.value}`);
        break;

      case 'removed':
        lines.push(`  - ${item.key}: ${item.value}`);
        break;

      case 'changed':
        lines.push(
          `  - ${item.key}: ${item.oldValue}`,
          `  + ${item.key}: ${item.newValue}`
        );
        break;

      case 'unchanged':
        lines.push(`    ${item.key}: ${item.value}`);
        break;

      default:
        break;
    }
  });

  return `{\n${lines.join('\n')}\n}`;
}