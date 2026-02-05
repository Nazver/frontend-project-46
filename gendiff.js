import { Command } from "commander";
import * as fs from "fs";

const program = new Command();
program
  .name("gendiff")
  .arguments("file1")
  .arguments("file2")
  .description("Compares two configuration files and shows a difference.")
  .version("1.0.0")
  .option("-f, --format", "output format")
  .action((file1, file2) => {
   const filedata1 = JSON.parse(fs.readFileSync(file1, "utf8"));
    const filedata2 = JSON.parse(fs.readFileSync(file2, "utf8"));
    
    const diffResult = diff(filedata1, filedata2);
    console.log(formatDiff(diffResult));
  });

function diff(file1, file2) {
  const allKeys = new Set([...Object.keys(file1), ...Object.keys(file2)]);
  const result = [];
  
  const sortedKeys = Array.from(allKeys).sort();
  
  for (const key of sortedKeys) {
    const value1 = file1[key];
    const value2 = file2[key];
    
    if (!(key in file1) && key in file2) {
      result.push({ key, status: "added", value: value2 });
    } else if (key in file1 && !(key in file2)) {
      result.push({ key, status: "removed", value: value1 });
    } else if (value1 !== value2) {
   
      result.push({ key, status: "changed", oldValue: value1, newValue: value2 });
    } else { 
      result.push({ key, status: 'unchanged', value: value1 });
    }
  }

  return result;
}
function formatDiff(diffArray) {
  const lines = [];
  
  diffArray.forEach(item => {
    switch(item.status) {
      case 'added':
        lines.push(`  + ${item.key}: ${item.value}`);
        break;
      case 'removed':
        lines.push(`  - ${item.key}: ${item.value}`);
        break;
      case 'changed':
        lines.push(`  - ${item.key}: ${item.oldValue}`);
        lines.push(`  + ${item.key}: ${item.newValue}`);
        break;
      case 'unchanged':
        lines.push(`    ${item.key}: ${item.value}`);
        break;
    }
  });
    return `{\n${lines.join('\n')}\n}`;
}
program.parse(process.argv);
