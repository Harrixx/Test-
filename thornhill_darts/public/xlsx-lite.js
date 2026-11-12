'use strict';
// Tiny dependency-free .xlsx reader for the admin import tool. Reads the first
// worksheet and returns an array of row objects keyed by the header row.
// Cell values are returned as text exactly as stored (no formula evaluation
// beyond Excel's cached values, no number reformatting).
window.readXlsx = async function readXlsx(arrayBuffer) {
  const u8 = new Uint8Array(arrayBuffer);
  const dv = new DataView(arrayBuffer);
  const dec = new TextDecoder();

  let eocd = u8.length - 22;
  while (eocd >= 0 && dv.getUint32(eocd, true) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('This does not look like an .xlsx file');
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const entries = {};
  for (let n = 0; n < count; n++) {
    if (dv.getUint32(off, true) !== 0x02014b50) throw new Error('Unreadable .xlsx file');
    const method = dv.getUint16(off + 10, true);
    const size = dv.getUint32(off + 20, true);
    const nameLen = dv.getUint16(off + 28, true);
    const extraLen = dv.getUint16(off + 30, true);
    const commentLen = dv.getUint16(off + 32, true);
    const local = dv.getUint32(off + 42, true);
    entries[dec.decode(u8.subarray(off + 46, off + 46 + nameLen))] = { method, size, local };
    off += 46 + nameLen + extraLen + commentLen;
  }

  async function read(name) {
    const e = entries[name];
    if (!e) return null;
    const start = e.local + 30 + dv.getUint16(e.local + 26, true) + dv.getUint16(e.local + 28, true);
    const data = u8.subarray(start, start + e.size);
    if (e.method === 0) return dec.decode(data);
    if (e.method !== 8) throw new Error('Unsupported compression in .xlsx file');
    const stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
  }
  const xml = (text) => new DOMParser().parseFromString(text, 'application/xml');
  const all = (node, tag) => [...node.getElementsByTagName(tag)];

  const shared = [];
  const sst = await read('xl/sharedStrings.xml');
  if (sst) for (const si of all(xml(sst), 'si')) {
    // Skip phonetic runs (<rPh>), keep plain and rich-text <t> nodes.
    shared.push(all(si, 't').filter((t) => t.parentNode.nodeName !== 'rPh').map((t) => t.textContent).join(''));
  }

  const sheetName = Object.keys(entries).filter((k) => /^xl\/worksheets\/sheet\d+\.xml$/.test(k))
    .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10))[0];
  if (!sheetName) throw new Error('No worksheet found in the .xlsx file');
  const sheet = xml(await read(sheetName));

  const colIndex = (ref) => {
    let n = 0;
    for (const ch of ref.replace(/\d+/g, '')) n = n * 26 + (ch.charCodeAt(0) - 64);
    return n - 1;
  };
  const grid = [];
  for (const row of all(sheet, 'row')) {
    const cells = [];
    all(row, 'c').forEach((c, i) => {
      const idx = c.getAttribute('r') ? colIndex(c.getAttribute('r')) : i;
      const type = c.getAttribute('t');
      const v = c.getElementsByTagName('v')[0]?.textContent;
      let value = '';
      if (type === 's') value = shared[Number(v)] ?? '';
      else if (type === 'inlineStr') value = all(c, 't').map((t) => t.textContent).join('');
      else if (v !== undefined) value = v;
      cells[idx] = value;
    });
    grid.push(Array.from(cells, (x) => x ?? ''));
  }
  const rows = grid.filter((r) => r.some((c) => String(c).trim() !== ''));
  if (!rows.length) return [];
  const header = rows[0].map((h) => String(h).trim());
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']).filter(([h]) => h !== '')));
};
