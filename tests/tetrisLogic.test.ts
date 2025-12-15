import { dropPiece, fieldToString, Field, movePieceDown, parseGameInput } from '../src/tetrisLogic';

describe('parseGameInput', () => {
  test('parses valid grid into field', () => {
    const raw = '4 3\n.p..\n....\n##p#';
    const field = parseGameInput(raw);
    expect(field.width).toBe(4);
    expect(field.height).toBe(3);
    expect(field.piece).toEqual([{ x: 1, y: 0 }, { x: 2, y: 2 }]);
    expect(field.landscape).toEqual([
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
    ]);
  });

  test('throws on invalid format', () => {
    const invalidRows = '3 2\n...\n..';
    expect(() => parseGameInput(invalidRows)).toThrow();
    const invalidChars = '2 1\n.a';
    expect(() => parseGameInput(invalidChars)).toThrow();
  });
});

describe('movePieceDown', () => {
  test('moves piece when space is free', () => {
    const field: Field = {
      width: 3,
      height: 3,
      piece: [{ x: 1, y: 0 }],
      landscape: [],
    };
    const moved = movePieceDown(field);
    expect(moved.piece).toEqual([{ x: 1, y: 1 }]);
    expect(moved).not.toBe(field);
  });

  test('stops when landscape blocks the path', () => {
    const field: Field = {
      width: 3,
      height: 3,
      piece: [{ x: 1, y: 1 }],
      landscape: [{ x: 1, y: 2 }],
    };
    const blocked = movePieceDown(field);
    expect(blocked).toBe(field);
  });
});

describe('dropPiece', () => {
  test('drops piece to the bottom of an empty field', () => {
    const field: Field = {
      width: 3,
      height: 4,
      piece: [{ x: 1, y: 0 }],
      landscape: [],
    };
    const dropped = dropPiece(field);
    expect(dropped.piece).toEqual([{ x: 1, y: 3 }]);
  });

  test('drops complex piece until it meets landscape', () => {
    const raw =
      '8 7\n' +
      '..p.....\n' +
      '.ppp....\n' +
      '..p.....\n' +
      '........\n' +
      '...#....\n' +
      '...#...#\n' +
      '#..#####';
    const field = parseGameInput(raw);
    const finalField = dropPiece(field);
    const expected =
      '........\n' +
      '........\n' +
      '..p.....\n' +
      '.ppp....\n' +
      '..p#....\n' +
      '...#...#\n' +
      '#..#####';
    expect(fieldToString(finalField)).toBe(expected);
  });
});

describe('fieldToString', () => {
  test('renders field with piece and landscape', () => {
    const field: Field = {
      width: 4,
      height: 3,
      piece: [
        { x: 2, y: 0 },
        { x: 0, y: 2 },
      ],
      landscape: [{ x: 1, y: 1 }],
    };
    expect(fieldToString(field)).toBe('..p.\n.#..\np...');
  });
});
