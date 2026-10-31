import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const required = [
  '<title>Codicent M3 MCP',
  'Read-oriented from the start',
  'docker pull izaxon/mcp-m3:1.8.0',
  'No automatic telemetry',
  'register_usage',
  'mailto:johan@codicent.com',
  'not affiliated with or endorsed by Infor',
];

for (const value of required) {
  if (!html.includes(value)) {
    throw new Error(`Missing required site content: ${value}`);
  }
}

const forbidden = [
  /M3_CLIENT_BASIC/i,
  /M3_PASSWORD/i,
  /M3_AUTH_URL/i,
  /M3_BASE_URL/i,
  /localhost:\d+/i,
  /ELPRESS_PRD/i,
];

for (const pattern of forbidden) {
  if (pattern.test(html)) {
    throw new Error(`Public site contains forbidden deployment detail: ${pattern}`);
  }
}

if ((html.match(/<h1\b/g) ?? []).length !== 1) {
  throw new Error('Public site must contain exactly one h1');
}

console.log('M3 public-site checks passed');
