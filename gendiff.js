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
    const filedata1 = fs.readFileSync(file1 ,'utf8');
    const filedata2 = fs.readFileSync(file2, 'utf8');
    console.log(JSON.parse(filedata1), JSON.parse(filedata2));
  });

program.parse(process.argv);
