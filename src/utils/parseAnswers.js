export function parseAnswersFromText(raw, totalQuestions) {
  const cleaned = raw
    .replace(/\r/g, '\n')
    .replace(/[;|]/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = cleaned
    .split(/[, ]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const out = Array.from({ length: totalQuestions }, () => null);

  for (let i = 0; i < Math.min(tokens.length, totalQuestions); i += 1) {
    const t = tokens[i].toUpperCase();
    out[i] = t === '-' || t === 'X' || t === 'NULL' ? null : t;
  }

  return out;
}
