import diff from './diff.js';
import formatDiff from './formatDiff.js';
import parseFile from './parsers.js';

export default function index(filePath1, filePath2) {
  const filedata1 = parseFile(filePath1);
  const filedata2 = parseFile(filePath2);
  const diffResult = diff(filedata1, filedata2);
  return formatDiff(diffResult);
}