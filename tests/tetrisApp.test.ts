import { runTetris, TetrisIO } from '../src/tetrisApp';

class FakeTetrisIO implements TetrisIO {
  inputText: string;

  lastOutput: string | null = null;

  lastError: string | null = null;

  outputCalls = 0;

  errorCalls = 0;

  constructor(inputText: string) {
    this.inputText = inputText;
  }

  readAll(): string {
    return this.inputText;
  }

  writeOutput(text: string): void {
    this.lastOutput = text;
    this.outputCalls += 1;
  }

  writeError(message: string): void {
    this.lastError = message;
    this.errorCalls += 1;
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
    expect(fake.outputCalls).toBe(1);
    expect(fake.errorCalls).toBe(0);
  });

  test('handles uneven landscape without mixing success and error', () => {
    const raw =
      '7 6\n' +
      '..pp...\n' +
      '..pp...\n' +
      '.......\n' +
      '...#...\n' +
      '..##...\n' +
      '###.#..';
    const fake = new FakeTetrisIO(raw);
    runTetris(fake);
    expect(fake.lastOutput).toBe('.......\n..pp...\n..pp...\n...#...\n..##...\n###.#..');
    expect(fake.lastError).toBeNull();
    expect(fake.outputCalls).toBe(1);
    expect(fake.errorCalls).toBe(0);
  });

  test('writes error for invalid input', () => {
    const fake = new FakeTetrisIO('invalid');
    runTetris(fake);
    expect(fake.lastOutput).toBeNull();
    expect(fake.lastError).toBe('Invalid input');
    expect(fake.outputCalls).toBe(0);
    expect(fake.errorCalls).toBe(1);
  });
});
