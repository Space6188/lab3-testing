import fs from 'fs';
import { runTetris, TetrisIO } from './tetrisApp';

class FileTetrisIO implements TetrisIO {
  private inputPath: string;

  private outputPath: string;

  constructor(inputPath: string, outputPath: string) {
    this.inputPath = inputPath;
    this.outputPath = outputPath;
  }

  readAll(): string {
    return fs.readFileSync(this.inputPath, 'utf-8');
  }

  writeOutput(text: string): void {
    fs.writeFileSync(this.outputPath, text);
    console.log(text);
  }

  writeError(message: string): void {
    console.error(message);
  }
}

const inputPath = process.argv[2] || 'input.txt';
const outputPath = process.argv[3] || 'output.txt';
const io = new FileTetrisIO(inputPath, outputPath);
runTetris(io);
