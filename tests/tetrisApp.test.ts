import { runTetris, TetrisIO } from '../src/tetrisApp';

class FakeTetrisIO implements TetrisIO {
  inputText: string;

  lastOutput: string | null = null;

  lastError: string | null = null;

  constructor(inputText: string) {
    this.inputText = inputText;
  }

  readAll(): string {
    return this.inputText;
  }

  writeOutput(text: string): void {
    this.lastOutput = text;
  }

  writeError(message: string): void {
    this.lastError = message;
  }
}

describe('runTetris', () => {
  test('writes output for valid input', () => {
    const raw =
      '6 6\n' +
      '..p...\n' +
      '.pp...\n' +
      '..p...\n' +
      '......\n' +
      '...#..\n' +
      '...#..';
    const fake = new FakeTetrisIO(raw);
    runTetris(fake);
    expect(fake.lastError).toBeNull();
    expect(fake.lastOutput).toBe('......\n......\n......\n..p...\n.pp#..\n..p#..');
  });

  test('writes error for invalid input', () => {
    const fake = new FakeTetrisIO('invalid');
    runTetris(fake);
    expect(fake.lastOutput).toBeNull();
    expect(fake.lastError).not.toBeNull();
  });
});
