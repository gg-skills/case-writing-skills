#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

const mermaidVersion = '12.0.0';
const mermaidCdn = `https://cdn.jsdelivr.net/npm/mermaid@${mermaidVersion}/dist/mermaid.min.js`;

const help = `Write HTML and PDF reading copies beside a canonical Markdown document.

Usage: ./scripts/render-reader-formats.ts --input FILE.md [--open FORMAT]
       pnpm run docs:render --input FILE.md
       pnpm run render --input FILE.md

Required:
  --input PATH      Markdown document to read. The file is not modified.
Options:
  --open FORMAT     After both copies exist, open one format: markdown, html, or pdf.
  --chrome PATH     Chrome or Chromium binary. Defaults to CASE_WRITING_CHROME
                    or a browser found on this machine.
  --mermaid PATH    Local mermaid.min.js for drawing diagrams offline. Defaults
                    to CASE_WRITING_MERMAID, then node_modules/mermaid next to
                    this program, then Mermaid ${mermaidVersion} from jsDelivr.
  --help, -h        Show this help without reading or writing documents.

Writes FILE.html and FILE.pdf next to FILE.md, replacing earlier reading
copies of that document. HTML is rendered by this program. PDF is printed
from that HTML with headless Chrome or Chromium. Relative links and images
are preserved.

A fenced mermaid block is drawn once, with Mermaid in headless Chrome, and
stored in the HTML as an inline SVG, so the HTML and the PDF show the
diagram without a script or a network connection. A diagram Mermaid
cannot draw stays as source text, and a warning goes to stderr. Other
fenced blocks stay as code.

A document that opens with a front-matter block holding a cover mapping
gets a cover page; that block holds only cover. Any other front matter,
such as an evidence file's provenance header, is printed as a small
metadata block at the top.

  ---
  cover:
    label: "Caso de ensino"
    title: "Acme"                  # required
    subtitle: "Should Acme keep the plant?"
    date: "June 2004"
    authors: ["Ana Souza", "João Lima"]
    institution: "Escola X"
    details: ["Strategy · Marketing", "Graduate"]
    notice: "For instructor use only"
    image: "assets/cover-motif.svg"  # relative path; omit for a typographic cover
    image_alt: "Abstract motif"
    image_credit: null
  ---

The cover is the first PDF page. Without image, the cover is typographic.

docs:render is the Case Writing command. render is the command inside a
case skill. Both run this program.

Examples:
  ./scripts/render-reader-formats.ts --input case-acme/case.md
  ./scripts/render-reader-formats.ts --input case-acme/teaching-note.md --open pdf

Ask which format to open before passing --open. Without --open, no file is launched.`;

const css = `
:root { color-scheme: light; }
body { margin: 0; color: #1a1a1a; font: 16px/1.5 "Iowan Old Style", Palatino, Georgia, serif; }
article { max-width: 42rem; margin: 2rem auto; padding: 0 1.25rem 3rem; }
h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 1.4em 0 0.4em; }
h1 { font-size: 1.8rem; }
p, ul, ol, blockquote, pre, table { margin: 0.8rem 0; }
ul, ol { padding-left: 1.4rem; }
blockquote { margin: 1rem 0 0.35rem; padding: 0.85rem 1.05rem; background: #f3efe6; border-left: 3px solid #8c2f2f; color: #1c1915; }
blockquote p { margin: 0; }
p.source-original { margin-top: 0.15rem; color: #5c564c; font-size: 0.95rem; }
code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.9em; }
pre { background: #f6f6f6; padding: 0.8rem 1rem; overflow: auto; }
pre.mermaid { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.85rem; }
figure.diagram { margin: 1.2rem 0; text-align: center; break-inside: avoid; }
figure.diagram svg { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
th, td { border: 1px solid #ccc; padding: 0.35rem 0.5rem; vertical-align: top; text-align: left; }
th { background: #f4f4f4; }
img { max-width: 100%; height: auto; }
a { color: #0b3d91; }
input[type="checkbox"] { margin-right: 0.35rem; }
pre.front-matter { margin: 0 0 1.5rem; padding: 0.6rem 0.8rem; background: #f7f5f0; color: #5c564c; font-size: 0.8rem; white-space: pre-wrap; }
section.cover { display: flex; flex-direction: column; gap: 0.6rem; margin: 0 0 2.5rem; padding: 0 0 2rem; border-bottom: 1px solid #d8d2c6; }
.cover-motif { margin: 0 0 1.2rem; }
.cover-motif img { display: block; width: 100%; max-height: 40vh; object-fit: contain; }
.cover-credit { margin: 0.3rem 0 0; color: #5c564c; font-size: 0.8rem; }
.cover-label { margin: 0; color: #8c2f2f; font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; }
.cover-title { margin: 0; font-size: 2.4rem; line-height: 1.15; font-weight: 700; }
.cover-subtitle { margin: 0; color: #3a352e; font-size: 1.25rem; font-style: italic; }
.cover-date { margin: 0.4rem 0 0; color: #3a352e; }
.cover-rule { width: 4rem; height: 3px; margin: 0.6rem 0; background: #8c2f2f; }
.cover-people, .cover-details { margin: 0; padding: 0; list-style: none; }
.cover-people li { font-size: 1.05rem; }
.cover-institution { margin: 0; color: #3a352e; }
.cover-details { color: #5c564c; font-size: 0.95rem; }
.cover-notice { margin: 0.8rem 0 0; padding: 0.4rem 0.7rem; border: 1px solid #8c2f2f; color: #8c2f2f; font-size: 0.9rem; align-self: flex-start; }
.cover-bottom { margin-top: auto; display: flex; flex-direction: column; gap: 0.5rem; }
@page { size: A4; margin: 16mm; }
@media print {
  article { max-width: none; margin: 0; padding: 0; }
  section.cover { box-sizing: border-box; height: 264mm; margin: 0; padding: 0; border: 0; break-after: page; }
  .cover-motif img { max-height: 120mm; }
  section.cover-typographic { padding-top: 70mm; }
  section.cover-typographic .cover-rule { width: 6rem; height: 4px; }
  .cover-rule, .cover-notice { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  th, blockquote { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
`.trim();

interface ListItem {
  indent: number;
  ordered: boolean;
  text: string;
}

export interface Cover {
  label?: string;
  title: string;
  subtitle?: string;
  date?: string;
  authors?: string[];
  institution?: string;
  details?: string[];
  notice?: string;
  image?: string;
  image_alt?: string;
  image_credit?: string;
}

const coverText = ['label', 'title', 'subtitle', 'date', 'institution', 'notice', 'image', 'image_alt', 'image_credit'] as const;
const coverLists = ['authors', 'details'] as const;

export function renderDocument(markdown: string, titleFallback: string): string {
  const normalized = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const { cover, metadata, body } = splitFrontMatter(normalized);
  const rendered = renderBlocks(body.split('\n'), titleFallback);
  const title = escapeHtml(cover ? cover.title : rendered.title);
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${css}</style>
</head>
<body>
<article>
${cover ? `${renderCover(cover)}\n` : ''}${metadata ? `<pre class="front-matter"><code>${escapeHtml(metadata)}</code></pre>\n` : ''}${rendered.body}
</article>
</body>
</html>
`;
}

/** Separates a leading front-matter block. Only a `cover` mapping is accepted. */
export function splitFrontMatter(markdown: string): { cover: Cover | null; metadata: string | null; body: string } {
  const lines = markdown.split('\n');
  if (lines[0]?.trim() !== '---') return { cover: null, metadata: null, body: markdown };
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end < 0) throw new Error('Front matter opens with --- but never closes.');
  const block = lines.slice(1, end);
  const body = lines.slice(end + 1).join('\n');
  const meaningful = block.filter((line) => line.trim() !== '' && !line.trim().startsWith('#'));
  if (meaningful.length === 0) return { cover: null, metadata: null, body };
  if (meaningful[0]?.trimEnd() !== 'cover:') return { cover: null, metadata: block.join('\n').trim(), body };
  const fields = new Map<string, string | string[] | null>();
  let listKey: string | null = null;
  for (const raw of meaningful.slice(1)) {
    const item = /^ {4,}- (.*)$/.exec(raw);
    if (item?.[1] !== undefined && listKey !== null) {
      const list = fields.get(listKey);
      const value = parseScalar(item[1]);
      if (value !== null) fields.set(listKey, [...(Array.isArray(list) ? list : []), value]);
      continue;
    }
    const pair = /^ {2}([a-z_]+):(?:\s+(.*))?$/.exec(raw);
    if (!pair?.[1]) throw new Error(`Cover line not understood: ${raw.trim()}`);
    const key = pair[1];
    if (fields.has(key)) throw new Error(`Cover field repeated: ${key}`);
    const value = stripComment(pair[2] ?? '');
    if (value === '') {
      fields.set(key, []);
      listKey = key;
      continue;
    }
    listKey = null;
    fields.set(key, value.startsWith('[') ? parseFlowList(value) : parseScalar(value));
  }
  return { cover: toCover(fields), metadata: null, body };
}

function toCover(fields: Map<string, string | string[] | null>): Cover {
  const cover: Record<string, string | string[]> = {};
  for (const [key, value] of fields) {
    if ((coverText as readonly string[]).includes(key)) {
      if (Array.isArray(value)) {
        if (value.length > 0) throw new Error(`Cover field ${key} takes one value, not a list.`);
        continue;
      }
      if (value !== null && value.trim() !== '') cover[key] = value;
    } else if ((coverLists as readonly string[]).includes(key)) {
      const list = value === null ? [] : Array.isArray(value) ? value : [value];
      const kept = list.filter((entry) => entry.trim() !== '');
      if (kept.length > 0) cover[key] = kept;
    } else {
      throw new Error(`Unknown cover field: ${key}`);
    }
  }
  const title = cover['title'];
  if (typeof title !== 'string') throw new Error('The cover needs a title.');
  return { ...cover, title };
}

function stripComment(value: string): string {
  let quote: string | null = null;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (quote) {
      if (char === '\\' && quote === '"') index += 1;
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '#' && (index === 0 || /\s/.test(value[index - 1] ?? ''))) {
      return value.slice(0, index).trim();
    }
  }
  return value.trim();
}

function parseScalar(raw: string): string | null {
  const value = stripComment(raw);
  if (value === '' || value === 'null' || value === '~') return null;
  if (value.startsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(value);
      if (typeof parsed === 'string') return parsed;
    } catch { /* reported below */ }
    throw new Error(`Cover value is not a valid double-quoted string: ${value}`);
  }
  if (value.startsWith("'")) {
    if (value.length < 2 || !value.endsWith("'")) throw new Error(`Cover value is not a valid single-quoted string: ${value}`);
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function parseFlowList(value: string): string[] {
  if (!value.endsWith(']')) throw new Error(`Cover list must close with ]: ${value}`);
  const inner = value.slice(1, -1);
  const items: string[] = [];
  let current = '';
  let quote: string | null = null;
  for (let index = 0; index < inner.length; index += 1) {
    const char = inner[index] ?? '';
    if (quote) {
      current += char;
      if (char === '\\' && quote === '"') {
        current += inner[index + 1] ?? '';
        index += 1;
      } else if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === ',') {
      items.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (quote) throw new Error(`Cover list has an unclosed quote: ${value}`);
  if (current.trim() !== '' || items.length > 0) items.push(current);
  return items.map((item) => parseScalar(item.trim())).filter((item): item is string => item !== null);
}

function renderCover(cover: Cover): string {
  const parts: string[] = [`<section class="cover${cover.image ? '' : ' cover-typographic'}">`];
  if (cover.image) {
    parts.push('<figure class="cover-motif">');
    parts.push(`<img src="${escapeAttr(safeUrl(cover.image))}" alt="${escapeAttr(cover.image_alt ?? '')}">`);
    if (cover.image_credit) parts.push(`<figcaption class="cover-credit">${inline(cover.image_credit)}</figcaption>`);
    parts.push('</figure>');
  }
  if (cover.label) parts.push(`<p class="cover-label">${inline(cover.label)}</p>`);
  parts.push(`<p class="cover-title" role="heading" aria-level="1">${inline(cover.title)}</p>`);
  if (cover.subtitle) parts.push(`<p class="cover-subtitle">${inline(cover.subtitle)}</p>`);
  if (cover.date) parts.push(`<p class="cover-date">${inline(cover.date)}</p>`);
  parts.push('<div class="cover-rule"></div>');
  const bottom: string[] = [];
  if (cover.authors) bottom.push(`<ul class="cover-people">${cover.authors.map((name) => `<li>${inline(name)}</li>`).join('')}</ul>`);
  if (cover.institution) bottom.push(`<p class="cover-institution">${inline(cover.institution)}</p>`);
  if (cover.details) bottom.push(`<ul class="cover-details">${cover.details.map((line) => `<li>${inline(line)}</li>`).join('')}</ul>`);
  if (cover.notice) bottom.push(`<p class="cover-notice">${inline(cover.notice)}</p>`);
  if (bottom.length > 0) parts.push(`<div class="cover-bottom">\n${bottom.join('\n')}\n</div>`);
  parts.push('</section>');
  return parts.join('\n');
}

function renderBlocks(lines: string[], titleFallback: string): { title: string; body: string } {
  const html: string[] = [];
  let title = titleFallback;
  let titled = false;
  let index = 0;
  while (index < lines.length) {
    const line = lines[index] ?? '';
    if (line.trim() === '') {
      index += 1;
      continue;
    }
    const fence = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (fence?.[1]) {
      const marker = fence[1];
      const info = (fence[2] ?? '').trim();
      const content: string[] = [];
      index += 1;
      while (index < lines.length && !closingFence(lines[index] ?? '', marker)) {
        content.push(lines[index] ?? '');
        index += 1;
      }
      if (index < lines.length) index += 1;
      const lang = /^[A-Za-z0-9_-]+/.exec(info)?.[0];
      if (lang?.toLowerCase() === 'mermaid') {
        html.push(`<pre class="mermaid">${escapeHtml(content.join('\n'))}</pre>`);
        continue;
      }
      const cls = lang ? ` class="language-${lang}"` : '';
      html.push(`<pre><code${cls}>${escapeHtml(content.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*?)\s*#*$/.exec(line);
    if (heading?.[1] && heading[2] !== undefined) {
      const level = heading[1].length;
      const text = heading[2].trim();
      if (level === 1 && !titled) {
        title = visibleText(inline(text));
        titled = true;
      }
      html.push(`<h${String(level)}>${inline(text)}</h${String(level)}>`);
      index += 1;
      continue;
    }
    if (/^ {0,3}([-*_])\1{2,}\s*$/.test(line)) {
      html.push('<hr>');
      index += 1;
      continue;
    }
    if (isTableStart(lines, index)) {
      const table = readTable(lines, index);
      html.push(table.html);
      index = table.next;
      continue;
    }
    if (isListLine(line)) {
      const list = readList(lines, index);
      html.push(renderAllItems(list.items));
      index = list.next;
      continue;
    }
    if (/^ {0,3}>\s?/.test(line)) {
      const quoted: string[] = [];
      while (index < lines.length && /^ {0,3}>\s?/.test(lines[index] ?? '')) {
        quoted.push((lines[index] ?? '').replace(/^ {0,3}>\s?/, ''));
        index += 1;
      }
      html.push(`<blockquote>\n${renderBlocks(quoted, titleFallback).body}\n</blockquote>`);
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && !isStructural(lines, index)) {
      paragraph.push(lines[index] ?? '');
      index += 1;
    }
    const original = isSourceOriginal(paragraph);
    html.push(`<p${original ? ' class="source-original"' : ''}>${joinParagraph(paragraph)}</p>`);
  }
  return { title, body: html.join('\n') };
}

function closingFence(line: string, marker: string): boolean {
  const trimmed = line.trim();
  const char = marker[0];
  if (!char || trimmed.length < marker.length) return false;
  for (let index = 0; index < trimmed.length; index += 1) {
    if (trimmed[index] !== char) return false;
  }
  return true;
}

function isStructural(lines: string[], index: number): boolean {
  const line = lines[index] ?? '';
  if (line.trim() === '') return true;
  if (/^ {0,3}(`{3,}|~{3,})/.test(line)) return true;
  if (/^(#{1,6})\s+/.test(line)) return true;
  if (/^ {0,3}([-*_])\1{2,}\s*$/.test(line)) return true;
  if (/^ {0,3}>\s?/.test(line)) return true;
  if (isListLine(line)) return true;
  return isTableStart(lines, index);
}

function isListLine(line: string): boolean {
  return /^(\s*)(?:[-*+]|\d+[.)])\s+\S/.test(line);
}

function isTableStart(lines: string[], index: number): boolean {
  const header = lines[index] ?? '';
  const separator = lines[index + 1] ?? '';
  return header.includes('|') && isSeparator(separator);
}

function isSeparator(line: string): boolean {
  const cells = splitRow(line);
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function splitRow(line: string): string[] {
  let value = line.trim();
  if (value.startsWith('|')) value = value.slice(1);
  if (value.endsWith('|')) value = value.slice(0, -1);
  return value.split('|').map((cell) => cell.trim());
}

function readTable(lines: string[], start: number): { html: string; next: number } {
  const header = splitRow(lines[start] ?? '');
  const aligns = splitRow(lines[start + 1] ?? '').map(alignment);
  const rows: string[][] = [];
  let index = start + 2;
  while (index < lines.length && (lines[index] ?? '').includes('|') && (lines[index] ?? '').trim() !== '') {
    rows.push(splitRow(lines[index] ?? ''));
    index += 1;
  }
  const head = header.map((cell, cellIndex) => `<th${alignStyle(aligns[cellIndex])}>${inline(cell)}</th>`).join('');
  const body = rows.map((row) => {
    const cells = row.map((cell, cellIndex) => `<td${alignStyle(aligns[cellIndex])}>${inline(cell)}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('\n');
  return { html: `<table>\n<thead><tr>${head}</tr></thead>\n<tbody>\n${body}\n</tbody>\n</table>`, next: index };
}

function alignment(cell: string): 'left' | 'right' | 'center' {
  if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
  if (cell.endsWith(':')) return 'right';
  return 'left';
}

function alignStyle(align: 'left' | 'right' | 'center' | undefined): string {
  if (!align || align === 'left') return '';
  return ` style="text-align: ${align}"`;
}

function readList(lines: string[], start: number): { items: ListItem[]; next: number } {
  const items: ListItem[] = [];
  let index = start;
  while (index < lines.length) {
    const line = lines[index] ?? '';
    const match = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
    if (match?.[1] !== undefined && match[2] && match[3] !== undefined) {
      items.push({ indent: match[1].length, ordered: /\d/.test(match[2]), text: match[3] });
      index += 1;
      continue;
    }
    const previous = items.at(-1);
    if (previous && /^ {2,}\S/.test(line)) {
      previous.text = `${previous.text} ${line.trim()}`;
      index += 1;
      continue;
    }
    break;
  }
  return { items, next: index };
}

function renderAllItems(items: ListItem[]): string {
  let html = '';
  let index = 0;
  while (index < items.length) {
    const part = renderItems(items, index, 0);
    if (part.next <= index) break;
    html += part.html;
    index = part.next;
  }
  return html;
}

function renderItems(items: ListItem[], start: number, minIndent: number): { html: string; next: number } {
  const current = items[start];
  if (!current || current.indent < minIndent) return { html: '', next: start };
  const indent = current.indent;
  const ordered = current.ordered;
  const tag = ordered ? 'ol' : 'ul';
  let html = `<${tag}>`;
  let index = start;
  while (index < items.length) {
    const item = items[index];
    if (!item || item.indent !== indent || item.ordered !== ordered) break;
    index += 1;
    let inner = itemBody(item.text);
    const child = items[index];
    if (child && child.indent > indent) {
      const nested = renderItems(items, index, indent + 1);
      inner += nested.html;
      index = nested.next;
    }
    html += `<li>${inner}</li>`;
  }
  html += `</${tag}>`;
  return { html, next: index };
}

function itemBody(text: string): string {
  const box = /^\[([ xX])\]\s+(.*)$/.exec(text);
  if (!box?.[1] || box[2] === undefined) return inline(text);
  const checked = box[1].toLowerCase() === 'x' ? ' checked' : '';
  return `<input type="checkbox" disabled${checked}> ${inline(box[2])}`;
}

function isSourceOriginal(lines: string[]): boolean {
  return /^\*(?:No original|Original):\*/i.test(lines[0]?.trim() ?? '');
}

function joinParagraph(lines: string[]): string {
  return lines.map((line, index) => {
    const breakAfter = / {2}$/.test(line);
    const text = inline(line.trimEnd());
    if (index === lines.length - 1) return text;
    return breakAfter ? `${text}<br>` : `${text} `;
  }).join('');
}

function inline(source: string): string {
  let index = 0;
  let html = '';
  while (index < source.length) {
    if (source.startsWith('`', index)) {
      const end = source.indexOf('`', index + 1);
      if (end > index) {
        html += `<code>${escapeHtml(source.slice(index + 1, end))}</code>`;
        index = end + 1;
        continue;
      }
    }
    const image = source.startsWith('![', index);
    if (image || source.startsWith('[', index)) {
      const link = parseLink(source, image ? index + 1 : index);
      if (link) {
        const href = safeUrl(link.href);
        html += image
          ? `<img src="${escapeAttr(href)}" alt="${escapeAttr(visibleText(inline(link.text)))}">`
          : `<a href="${escapeAttr(href)}">${inline(link.text)}</a>`;
        index = link.end;
        continue;
      }
    }
    if (source.startsWith('**', index) || source.startsWith('__', index)) {
      const marker = source.slice(index, index + 2);
      const end = source.indexOf(marker, index + 2);
      if (end > index + 2) {
        html += `<strong>${inline(source.slice(index + 2, end))}</strong>`;
        index = end + 2;
        continue;
      }
    }
    const marker = source[index];
    if ((marker === '*' || marker === '_') && source[index + 1] !== marker && source[index + 1] !== undefined) {
      const end = source.indexOf(marker, index + 1);
      if (end > index + 1) {
        html += `<em>${inline(source.slice(index + 1, end))}</em>`;
        index = end + 1;
        continue;
      }
    }
    const next = nextSpecial(source, index + 1);
    html += escapeHtml(source.slice(index, next));
    index = next;
  }
  return html;
}

function nextSpecial(source: string, start: number): number {
  let nearest = source.length;
  for (const special of ['`', '!', '*', '_', '[']) {
    const found = source.indexOf(special, start);
    if (found !== -1 && found < nearest) nearest = found;
  }
  return nearest;
}

function parseLink(source: string, start: number): { text: string; href: string; end: number } | null {
  if (source[start] !== '[') return null;
  const close = source.indexOf(']', start + 1);
  if (close < 0 || source[close + 1] !== '(') return null;
  const endParen = source.indexOf(')', close + 2);
  if (endParen < 0) return null;
  let href = source.slice(close + 2, endParen).trim();
  const titled = /^(\S+)\s+["'].*["']$/.exec(href);
  if (titled?.[1]) href = titled[1];
  return { text: source.slice(start + 1, close), href, end: endParen + 1 };
}

function safeUrl(href: string): string {
  const trimmed = href.trim();
  if (/^(#|\/|\.\/|\.\.\/)/.test(trimmed)) return trimmed;
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) {
    return /^(https?|mailto):/i.test(trimmed) ? trimmed : '#';
  }
  return trimmed;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", '&#39;');
}

function visibleText(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

function main(): number {
  let values: {
    input?: string;
    open?: string;
    chrome?: string;
    mermaid?: string;
    help?: boolean;
  };
  try {
    values = parseArgs({
      options: {
        input: { type: 'string' },
        open: { type: 'string' },
        chrome: { type: 'string' },
        mermaid: { type: 'string' },
        help: { type: 'boolean', short: 'h' },
      },
      strict: true,
    }).values;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    console.log(help);
    return 2;
  }
  if (values.help) {
    console.log(help);
    return 0;
  }
  const format = values.open?.toLowerCase();
  if (!values.input || (format !== undefined && format !== 'markdown' && format !== 'html' && format !== 'pdf')) {
    console.error(values.input ? '--open must be markdown, html, or pdf.' : '--input is required.');
    console.log(help);
    return 2;
  }
  const input = resolve(values.input);
  if (!existsSync(input) || !statSync(input).isFile() || !input.toLowerCase().endsWith('.md')) {
    throw new Error('--input must be an existing .md file.');
  }
  const directory = dirname(input);
  const stem = basename(input).replace(/\.md$/i, '');
  const htmlPath = join(directory, `${stem}.html`);
  const pdfPath = join(directory, `${stem}.pdf`);
  const markdown = readFileSync(input, 'utf8');
  const { cover } = splitFrontMatter(markdown.replace(/\r\n?/g, '\n'));
  if (cover?.image && !/^[a-z][a-z0-9+.-]*:/i.test(cover.image) && !existsSync(resolve(directory, cover.image))) {
    throw new Error(`Cover image not found: ${cover.image}`);
  }
  let html = renderDocument(markdown, stem);
  const work = join(tmpdir(), `case-reader-${String(process.pid)}`);
  const htmlTemp = join(directory, `.${stem}.${String(process.pid)}.html`);
  const pdfTemp = join(directory, `.${stem}.${String(process.pid)}.pdf`);
  mkdirSync(work, { recursive: true });
  try {
    if (html.includes('<pre class="mermaid">')) {
      const drawn = drawDiagrams(values.chrome, values.mermaid ?? process.env['CASE_WRITING_MERMAID'] ?? localMermaid(), html, htmlTemp, join(work, 'diagrams'));
      html = drawn.html;
      if (drawn.warning) console.error(drawn.warning);
    }
    writeFileSync(htmlTemp, html);
    printPdf(values.chrome, htmlTemp, pdfTemp, join(work, 'print'));
    renameSync(pdfTemp, pdfPath);
    renameSync(htmlTemp, htmlPath);
  } finally {
    rmSync(htmlTemp, { force: true });
    rmSync(pdfTemp, { force: true });
    try {
      rmSync(work, { recursive: true, force: true });
    } catch {
      // Chrome can release its profile slightly after the PDF is complete.
    }
  }
  if (readFileSync(input, 'utf8') !== markdown) {
    throw new Error('The Markdown file changed while the reading copies were written.');
  }
  console.log(`${htmlPath}\n${pdfPath}`);
  if (format === 'markdown') openFile(input);
  if (format === 'html') openFile(htmlPath);
  if (format === 'pdf') openFile(pdfPath);
  return 0;
}

/**
 * Draws each mermaid block as an inline SVG with Mermaid in headless Chrome.
 * On failure the blocks stay as source text and a warning is returned.
 */
function drawDiagrams(
  explicitChrome: string | undefined,
  mermaidPath: string | undefined,
  html: string,
  pagePath: string,
  profile: string,
): { html: string; warning: string | null } {
  if (mermaidPath && !existsSync(mermaidPath)) throw new Error(`Mermaid not found: ${mermaidPath}`);
  const source = mermaidPath ? pathToFileURL(resolve(mermaidPath)).href : mermaidCdn;
  const library = `<script id="case-reader-mermaid-lib" src="${escapeAttr(source)}"></script>`;
  const runner = `<script id="case-reader-mermaid-run">
(async () => {
  const done = (state, failed) => { document.body.dataset.caseReaderDiagrams = state; document.body.dataset.caseReaderFailed = String(failed); };
  if (typeof mermaid === 'undefined') { done('unavailable', 0); return; }
  mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict', fontFamily: 'Iowan Old Style, Palatino, Georgia, serif' });
  let failed = 0;
  const blocks = [...document.querySelectorAll('pre.mermaid')];
  for (const [index, block] of blocks.entries()) {
    try {
      const { svg } = await mermaid.render('case-diagram-' + (index + 1), block.textContent);
      const figure = document.createElement('figure');
      figure.className = 'diagram';
      figure.innerHTML = svg;
      block.replaceWith(figure);
    } catch {
      failed += 1;
      document.querySelectorAll('[id^="dcase-diagram-"], #case-diagram-' + (index + 1)).forEach((node) => { if (!node.closest('article')) node.remove(); });
    }
  }
  done('done', failed);
})();
</script>`;
  const page = html.replace('</body>', `${library}\n${runner}\n</body>`);
  const chrome = findChrome(explicitChrome);
  const outPath = `${pagePath}.dom`;
  mkdirSync(profile, { recursive: true });
  writeFileSync(pagePath, page);
  const out = openSync(outPath, 'w');
  let dom = '';
  try {
    const child = spawn(chrome, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
      '--allow-file-access-from-files', `--user-data-dir=${profile}`, '--virtual-time-budget=20000', '--dump-dom',
      pathToFileURL(pagePath).href,
    ], { stdio: ['ignore', out, 'ignore'], detached: true });
    const pid = child.pid;
    if (pid === undefined) throw new Error('Chrome did not start.');
    const started = Date.now();
    while (Date.now() - started < 45_000) {
      sleep(200);
      dom = readFileSync(outPath, 'utf8');
      if (dom.includes('</html>')) break;
    }
    try { process.kill(-pid, 'SIGKILL'); } catch { /* Chrome may already have exited. */ }
  } finally {
    closeSync(out);
    rmSync(outPath, { force: true });
    rmSync(pagePath, { force: true });
  }
  const state = /data-case-reader-diagrams="([a-z]+)"/.exec(dom)?.[1];
  if (state !== 'done') {
    const reason = state === 'unavailable'
      ? `Mermaid could not be loaded from ${mermaidPath ?? mermaidCdn}`
      : 'Mermaid did not finish in time';
    return { html, warning: `Diagrams stay as source text: ${reason}. Pass --mermaid PATH or set CASE_WRITING_MERMAID to draw them offline.` };
  }
  const failed = Number(/data-case-reader-failed="(\d+)"/.exec(dom)?.[1] ?? '0');
  const cleaned = dom
    .replace(/<script id="case-reader-mermaid-(?:lib|run)"[\s\S]*?<\/script>\s*/g, '')
    .replace(/ data-case-reader-(?:diagrams|failed)="[^"]*"/g, '');
  return {
    html: `<!DOCTYPE html>\n${cleaned.trim()}\n`,
    warning: failed > 0 ? `${String(failed)} diagram(s) could not be drawn and stay as source text. Check the Mermaid syntax.` : null,
  };
}

function localMermaid(): string | undefined {
  const bundled = join(import.meta.dirname, '..', 'node_modules', 'mermaid', 'dist', 'mermaid.min.js');
  return existsSync(bundled) ? bundled : undefined;
}

function printPdf(explicit: string | undefined, htmlPath: string, pdfPath: string, profile: string): void {
  const chrome = findChrome(explicit);
  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--allow-file-access-from-files',
    `--user-data-dir=${profile}`,
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore', detached: true });
  const pid = child.pid;
  if (pid === undefined) throw new Error('Chrome did not start.');
  const started = Date.now();
  let stable = 0;
  let lastSize = -1;
  while (Date.now() - started < 30_000) {
    sleep(200);
    if (!pdfReady(pdfPath)) {
      stable = 0;
      continue;
    }
    const size = statSync(pdfPath).size;
    stable = size === lastSize ? stable + 1 : 0;
    lastSize = size;
    if (stable >= 2) break;
  }
  try { process.kill(-pid, 'SIGKILL'); } catch { /* Chrome may already have exited. */ }
  if (!pdfReady(pdfPath)) {
    throw new Error('Chrome did not write a PDF. Install Google Chrome or pass --chrome PATH.');
  }
}

function pdfReady(path: string): boolean {
  if (!existsSync(path)) return false;
  const bytes = readFileSync(path);
  if (bytes.length < 8 || bytes.subarray(0, 5).toString() !== '%PDF-') return false;
  return bytes.subarray(Math.max(0, bytes.length - 32)).toString().includes('%%EOF');
}

function findChrome(explicit: string | undefined): string {
  const requested = explicit ?? process.env['CASE_WRITING_CHROME'];
  if (requested) {
    if (!existsSync(requested)) throw new Error(`Chrome not found: ${requested}`);
    return requested;
  }
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('Google Chrome or Chromium is required to write the PDF. Pass --chrome PATH or set CASE_WRITING_CHROME.');
}

function openFile(path: string): void {
  if (process.platform === 'darwin') {
    spawnSync('open', [path], { stdio: 'ignore' });
    return;
  }
  if (process.platform === 'win32') {
    spawnSync('cmd', ['/c', 'start', '', path], { stdio: 'ignore' });
    return;
  }
  spawnSync('xdg-open', [path], { stdio: 'ignore' });
}

function sleep(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  return entry !== undefined && import.meta.url === pathToFileURL(resolve(entry)).href;
}

if (isDirectRun()) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
