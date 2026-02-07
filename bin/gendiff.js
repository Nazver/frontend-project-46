import { Command } from 'commander'
import idnex from '../src/index.js'

const program = new Command()
program
  .name('gendiff')
  .arguments('file1')
  .arguments('file2')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format', 'output format')
  .action((file1, file2) => {
    console.log(idnex(file1, file2))
  })

program.parse(process.argv)
