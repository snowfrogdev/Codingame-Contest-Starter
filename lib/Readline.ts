let eof = false;
export function readline(): string {
  var r = '',
    b = Buffer.alloc(10),
    bi = 0,
    bl = 0;
  b.fill(0);
  while (1) {
    var br = require('fs').readSync(0, b, bi, 1, null);
    if (!br) {
      eof = true;
      r += b.toString('utf-8', 0, bi);
      return r;
    }
    var byte = b[bi];
    bi += br;

    if (bl) {
      bl--;
      if ((byte & 0xc0) !== 0x80) {
        console.error('readline: invalid utf-8 code point');
      }
    } else {
      if ((byte & 0xc0) == 0x80) {
        console.error('readline: invalid utf-8 code point');
      }
      if ((byte & 0xe0) == 0xc0) {
        bl = 1;
      }
      if ((byte & 0xf0) == 0xe0) {
        bl = 2;
      }
      if ((byte & 0xf8) == 0xf0) {
        bl = 3;
      }
    }

    var eoln = byte == 0x0a;
    if (eoln) {
      bl = 0;
      bi--;
    }

    if (!bl) {
      r += b.toString('utf-8', 0, bi);
      bi = 0;
    }

    if (eoln || eof) {
      return r;
    }
  }

  throw new Error('Reached the end of the function and we should not have.');
}
