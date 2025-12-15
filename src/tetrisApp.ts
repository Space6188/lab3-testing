import { dropPiece, fieldToString, parseGameInput } from './tetrisLogic';

export interface TetrisIO {
  readAll(): string;
  writeOutput(text: string): void;
  writeError(message: string): void;
}

export function runTetris(io: TetrisIO): void {
  try {
    const raw = io.readAll();
    const field = parseGameInput(raw);
    const finalField = dropPiece(field);
    const output = fieldToString(finalField);
    io.writeOutput(output);
  } catch (error) {
    io.writeError('Invalid input');
  }
}
