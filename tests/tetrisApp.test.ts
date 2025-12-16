import { runTetris, TetrisIO } from '../src/tetrisApp';

class FakeTetrisIO implements TetrisIO {
  inputText: string;
  lastOutput: string | null = null;
  lastError: string | null = null;
  outputCalls = 0;
  errorCalls = 0;
  readCalls = 0;
  outputHistory: string[] = [];
  errorHistory: string[] = [];

  constructor(inputText: string) {
    this.inputText = inputText;
  }

  readAll(): string {
    this.readCalls += 1;
    return this.inputText;
  }

  writeOutput(text: string): void {
    this.lastOutput = text;
    this.outputCalls += 1;
    this.outputHistory.push(text);
  }

  writeError(message: string): void {
    this.lastError = message;
    this.errorCalls += 1;
    this.errorHistory.push(message);
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

  test('records history when reused across success and failure', () => {
    const raw =
      '5 5\n' +
      'p....\n' +
      '.p...\n' +
      '.p...\n' +
      '.....\n' +
      '..#..';
    const fake = new FakeTetrisIO(raw);
    runTetris(fake);
    fake.inputText = 'bad input';
    runTetris(fake);
    expect(fake.readCalls).toBe(2);
    expect(fake.outputHistory).toEqual(['.....\n.....\np....\n.p...\n.p#..']);
    expect(fake.errorHistory).toEqual(['Invalid input']);
    expect(fake.outputCalls).toBe(1);
    expect(fake.errorCalls).toBe(1);
    expect(fake.lastOutput).toBe('.....\n.....\np....\n.p...\n.p#..');
    expect(fake.lastError).toBe('Invalid input');
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
