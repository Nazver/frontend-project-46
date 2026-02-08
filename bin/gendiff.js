import { Command } from 'commander'
import { gendiff } from '../src/index.js'

const program = new Command()

program
  .name('gendiff')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((filepath1, filepath2) => {
    const options = program.opts()
    const result = gendiff(filepath1, filepath2, options.format)
    console.log(result)
  })

program.parse(process.argv)
