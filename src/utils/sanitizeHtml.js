export function sanitizeQuestionHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  doc.querySelectorAll('script, style').forEach((node) => node.remove());
  return doc.body.innerHTML;
}
