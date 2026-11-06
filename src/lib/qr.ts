/**
 * Lightweight, zero-dependency QR Code generator for ticket verification.
 * Supports Byte mode encoding with Error Correction Level M.
 */

export type QRCodeMatrix = boolean[][];

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  EXP[i + 255] = x;
  LOG[x] = i;
  x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
}

function gmul(a: number, b: number): number {
  return a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];
}

function rsGeneratorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let i = 0; i < degree; i++) {
    const next = new Uint8Array(poly.length + 1);
    const root = EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= gmul(poly[j], root);
      next[j + 1] ^= poly[j];
    }
    poly = next;
  }
  return poly;
}

function rsEncode(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount);
  const res = new Uint8Array(data.length + ecCount);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gmul(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

interface VersionSpec {
  version: number;
  size: number;
  dataBytes: number;
  ecBytes: number;
  alignPos: number[];
}

const VERSIONS: VersionSpec[] = [
  { version: 1, size: 21, dataBytes: 16, ecBytes: 10, alignPos: [] },
  { version: 2, size: 25, dataBytes: 28, ecBytes: 16, alignPos: [6, 18] },
  { version: 3, size: 29, dataBytes: 44, ecBytes: 26, alignPos: [6, 22] },
  { version: 4, size: 33, dataBytes: 64, ecBytes: 36, alignPos: [6, 26] },
  { version: 5, size: 37, dataBytes: 86, ecBytes: 48, alignPos: [6, 30] },
  { version: 6, size: 41, dataBytes: 108, ecBytes: 56, alignPos: [6, 34] },
];

export function generateQRCodeMatrix(text: string): QRCodeMatrix {
  const encoder = new TextEncoder();
  const rawBytes = encoder.encode(text);

  let spec = VERSIONS.find((v) => v.dataBytes >= rawBytes.length + 3);
  if (!spec) spec = VERSIONS[VERSIONS.length - 1];

  const size = spec.size;
  const matrix: (boolean | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null)
  );
  const isFunction: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  function addFinder(r: number, c: number) {
    for (let dr = -1; dr <= 7; dr++) {
      for (let dc = -1; dc <= 7; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          const isBlack =
            (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
            (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6)) ||
            (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
          matrix[nr][nc] = isBlack;
          isFunction[nr][nc] = true;
        }
      }
    }
  }

  addFinder(0, 0);
  addFinder(0, size - 7);
  addFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (!isFunction[6][i]) {
      matrix[6][i] = i % 2 === 0;
      isFunction[6][i] = true;
    }
    if (!isFunction[i][6]) {
      matrix[i][6] = i % 2 === 0;
      isFunction[i][6] = true;
    }
  }

  // Alignment patterns
  if (spec.alignPos.length > 0) {
    for (const ar of spec.alignPos) {
      for (const ac of spec.alignPos) {
        if (isFunction[ar][ac]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const isBlack =
              Math.max(Math.abs(dr), Math.abs(dc)) === 2 ||
              (dr === 0 && dc === 0);
            matrix[ar + dr][ac + dc] = isBlack;
            isFunction[ar + dr][ac + dc] = true;
          }
        }
      }
    }
  }

  // Dark module
  matrix[4 * spec.version + 9][8] = true;
  isFunction[4 * spec.version + 9][8] = true;

  // Format info areas
  for (let i = 0; i < 9; i++) {
    if (i < size) isFunction[8][i] = true;
    if (i < size) isFunction[i][8] = true;
  }
  for (let i = 0; i < 8; i++) {
    isFunction[8][size - 1 - i] = true;
    isFunction[size - 1 - i][8] = true;
  }

  // Bitstream (Byte mode 0100)
  const bitStream: number[] = [];
  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bitStream.push((val >> i) & 1);
    }
  };

  pushBits(0b0100, 4);
  pushBits(rawBytes.length, 8);
  for (const b of rawBytes) {
    pushBits(b, 8);
  }
  for (let i = 0; i < 4 && bitStream.length < spec.dataBytes * 8; i++) {
    bitStream.push(0);
  }
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitStream.length < spec.dataBytes * 8) {
    pushBits(padBytes[padIdx % 2], 8);
    padIdx++;
  }

  const dataBytes = new Uint8Array(spec.dataBytes);
  for (let i = 0; i < dataBytes.length; i++) {
    let b = 0;
    for (let j = 0; j < 8; j++) {
      b = (b << 1) | bitStream[i * 8 + j];
    }
    dataBytes[i] = b;
  }

  const ecBytes = rsEncode(dataBytes, spec.ecBytes);
  const totalBits: number[] = [];
  for (const b of dataBytes) {
    for (let i = 7; i >= 0; i--) totalBits.push((b >> i) & 1);
  }
  for (const b of ecBytes) {
    for (let i = 7; i >= 0; i--) totalBits.push((b >> i) & 1);
  }

  let bitIdx = 0;
  let dir = -1;
  let row = size - 1;

  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    while (true) {
      for (let c = 0; c < 2; c++) {
        const curCol = col - c;
        if (!isFunction[row][curCol]) {
          const bit = bitIdx < totalBits.length ? totalBits[bitIdx++] : 0;
          const mask = (row + curCol) % 2 === 0;
          matrix[row][curCol] = bit === 1 ? !mask : mask;
        }
      }
      row += dir;
      if (row < 0 || row >= size) {
        dir = -dir;
        row += dir;
        break;
      }
    }
  }

  // Format String for EC M + Mask 0
  const formatStr = "101010000010010";
  for (let i = 0; i < 15; i++) {
    const bit = formatStr[i] === "1";
    if (i <= 5) matrix[8][i] = bit;
    else if (i === 6) matrix[8][7] = bit;
    else if (i === 7) matrix[8][8] = bit;
    else if (i === 8) matrix[7][8] = bit;
    else matrix[14 - i][8] = bit;

    if (i < 8) matrix[size - 1 - i][8] = bit;
    else matrix[8][size - 15 + i] = bit;
  }

  return matrix.map((row) => row.map((c) => !!c));
}

