import { sanitizeQuestionHtml } from '../../utils/sanitizeHtml';

const html = '<p>Conteúdo de estudos</p><script>alert(1)</script>';

export default function EstudosPage() {
  return <div dangerouslySetInnerHTML={{ __html: sanitizeQuestionHtml(html) }} />;
}
