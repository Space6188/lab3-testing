export type CellChar = '.' | 'p' | '#';

export type Point = {
  x: number;
  y: number;
};

export type Field = {
  width: number;
  height: number;
  piece: Point[];
  landscape: Point[];
};

export function parseGameInput(raw: string): Field {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error('Invalid input');
  }
  const lines = trimmed.split(/\r?\n/);
  if (lines.length < 2) {
    throw new Error('Invalid input');
  }
  const [dimensions, ...gridLines] = lines;
  const [widthStr, heightStr] = dimensions.trim().split(/\s+/);
  const width = Number(widthStr);
  const height = Number(heightStr);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    throw new Error('Invalid input');
  }
  if (gridLines.length !== height) {
    throw new Error('Invalid input');
  }
  const piece: Point[] = [];
  const landscape: Point[] = [];
  gridLines.forEach((line, y) => {
    if (line.length !== width) {
      throw new Error('Invalid input');
    }
    for (let x = 0; x < line.length; x += 1) {
      const ch = line[x] as CellChar;
      if (ch !== '.' && ch !== 'p' && ch !== '#') {
        throw new Error('Invalid input');
      }
      if (ch === 'p') {
        piece.push({ x, y });
      } else if (ch === '#') {
        landscape.push({ x, y });
      }
    }
  });
  if (piece.length === 0) {
    throw new Error('Invalid input');
  }
  return { width, height, piece, landscape };
}

export function canPieceMoveDown(field: Field): boolean {
  const blocked = new Set(field.landscape.map((p) => `${p.x},${p.y}`));
  return field.piece.every((p) => {
    const nextY = p.y + 1;
    if (nextY >= field.height) {
      return false;
    }
    return !blocked.has(`${p.x},${nextY}`);
  });
}

export function movePieceDown(field: Field): Field {
  if (!canPieceMoveDown(field)) {
    return field;
  }
  const movedPiece = field.piece.map((p) => ({ x: p.x, y: p.y + 1 }));
  return { ...field, piece: movedPiece };
}

export function dropPiece(field: Field): Field {
  let current = field;
  while (canPieceMoveDown(current)) {
    current = movePieceDown(current);
  }
  return current;
}

export function fieldToLines(field: Field): string[] {
  const grid = Array.from({ length: field.height }, () => Array(field.width).fill('.') as CellChar[]);
  field.landscape.forEach((p) => {
    grid[p.y][p.x] = '#';
  });
  field.piece.forEach((p) => {
    grid[p.y][p.x] = 'p';
  });
  return grid.map((row) => row.join(''));
}

export function fieldToString(field: Field): string {
  return fieldToLines(field).join('\n');
}
