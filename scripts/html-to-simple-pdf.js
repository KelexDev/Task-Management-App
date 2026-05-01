/* eslint-env node */

const fs = require('fs');

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/html-to-simple-pdf.js input.html output.pdf');
  process.exit(1);
}

const html = fs.readFileSync(inputPath, 'utf8');

const text = html
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<head[\s\S]*?<\/head>/gi, '')
  .replace(/<h1[^>]*>/gi, '\n\n# ')
  .replace(/<h2[^>]*>/gi, '\n\n## ')
  .replace(/<h3[^>]*>/gi, '\n\n### ')
  .replace(/<li[^>]*>/gi, '\n- ')
  .replace(/<tr[^>]*>/gi, '\n')
  .replace(/<td[^>]*>/gi, ' | ')
  .replace(/<th[^>]*>/gi, ' | ')
  .replace(/<\/p>/gi, '\n')
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<\/div>/gi, '\n')
  .replace(/<\/h[1-3]>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/\n{3,}/g, '\n\n')
  .split('\n')
  .map((line) => line.trim())
  .join('\n')
  .trim();

const wrapLine = (line, width) => {
  if (!line) {
    return [''];
  }

  const words = line.split(/\s+/);
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;

    if (next.length > width && current) {
      lines.push(current);
      current = word;
      return;
    }

    current = next;
  });

  if (current) {
    lines.push(current);
  }

  return lines;
};

const lines = text
  .split('\n')
  .flatMap((line) => wrapLine(line, 92));

const pageLines = [];
const maxLinesPerPage = 48;

for (let i = 0; i < lines.length; i += maxLinesPerPage) {
  pageLines.push(lines.slice(i, i + maxLinesPerPage));
}

const escapePdfText = (value) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');

const objects = [];
const addObject = (content) => {
  objects.push(content);
  return objects.length;
};

const catalogId = addObject('');
const pagesId = addObject('');
const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

const pageIds = [];
const contentIds = [];

pageLines.forEach((page, pageIndex) => {
  const commands = ['BT', '/F1 11 Tf', '50 770 Td', '14 TL'];

  if (pageIndex === 0) {
    commands.push('/F1 16 Tf');
  }

  page.forEach((line, lineIndex) => {
    if (pageIndex === 0 && lineIndex === 1) {
      commands.push('/F1 11 Tf');
    }

    commands.push(`(${escapePdfText(line)}) Tj`);
    commands.push('T*');
  });

  commands.push('ET');
  const stream = commands.join('\n');
  const contentId = addObject(`<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`);
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`
  );

  contentIds.push(contentId);
  pageIds.push(pageId);
});

objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds
  .map((id) => `${id} 0 R`)
  .join(' ')}] /Count ${pageIds.length} >>`;

let pdf = '%PDF-1.4\n';
const offsets = [0];

objects.forEach((object, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n`;
pdf += '0000000000 65535 f \n';

offsets.slice(1).forEach((offset) => {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
});

pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

fs.writeFileSync(outputPath, Buffer.from(pdf, 'latin1'));
console.log(`PDF creado: ${outputPath}`);
