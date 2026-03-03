import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProva, upsertSubmission } from '../../services/apiClient';
import { debounce } from '../../utils/debounce';
import AnswerGrid from './components/AnswerGrid';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AnswerSheetPage() {
  const { provaId } = useParams();
  const nav = useNavigate();
  const q = useQuery();

  const userId = localStorage.getItem('userId');

  const [prova, setProva] = useState(null);
  const [bookletType, setBookletType] = useState(q.get('type') || '');
  const [answers, setAnswers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [sub, setSub] = useState(null);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    (async () => {
      try {
        const p = await getProva(provaId);
        setProva(p);
        const t = bookletType || p.tipoProva?.[0] || 'UNICA';
        setBookletType(t);
        setAnswers(Array.from({ length: p.questoes.length }, () => null));
      } catch {
        window.alert('Não foi possível carregar a prova.');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provaId]);

  const totalQuestions = prova?.questoes.length ?? 0;
  const pageStart = (page - 1) * pageSize;
  const pageEnd = Math.min(totalQuestions, pageStart + pageSize);

  const saveDebounced = useMemo(
    () =>
      debounce(async (nextAnswers) => {
        if (!userId) {
          return;
        }
        if (!prova) return;

        setSaving(true);
        try {
          const data = await upsertSubmission({
            provaId: prova._id,
            userId,
            bookletType,
            answers: nextAnswers
          });
          setSub(data);
        } finally {
          setSaving(false);
        }
      }, 700),
    [bookletType, prova, userId]
  );

  function onAnswersChange(next) {
    setAnswers(next);
    saveDebounced(next);
  }

  function nextPage() {
    if (page * pageSize >= totalQuestions) return;
    setPage((p) => p + 1);
  }

  if (!prova) return <article className="card">Carregando...</article>;

  return (
    <section className="grid-gap">
      <article className="card">
        <div className="row between wrap">
          <div>
            <h2 style={{ margin: 0 }}>Responder (Grid)</h2>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              {prova.orgao} • {prova.cargo} • {prova.nomeProva}
            </p>
          </div>

          <div className="row wrap">
            <select
              value={bookletType}
              onChange={(e) => {
                setBookletType(e.target.value);
                saveDebounced(answers);
              }}
            >
              {prova.tipoProva.map((t) => (
                <option key={t} value={t}>
                  Tipo {t}
                </option>
              ))}
            </select>
            <button type="button" className="primary" onClick={() => nav(`/provas/${prova._id}/resultado`)}>
              Ver resultado
            </button>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

        <div className="row wrap">
          <span className="pill">Questões: {totalQuestions}</span>
          <span className="pill">{saving ? 'Salvando...' : 'Salvo'}</span>
          {sub ? <span className="pill">Gabarito: {sub.keyStageApplied}</span> : null}
          <span className="pill">
            Página: {page} ({pageStart + 1}–{pageEnd})
          </span>
        </div>

        {sub ? (
          <div className="row wrap" style={{ marginTop: 12 }}>
            <span className="pill">Acertos: {sub.totalCorrect}</span>
            <span className="pill">Erros: {sub.totalWrong}</span>
            <span className="pill">Brancos: {sub.totalBlank}</span>
            <span className="pill">Removidas: {sub.totalRemoved}</span>
            <span className="pill">Nota líquida: {sub.totalNet.toFixed(2)}</span>
          </div>
        ) : null}

        <hr style={{ border: 0, borderTop: '1px solid #e5e7eb', margin: '12px 0' }} />

        <div className="row between">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <button type="button" disabled={page * pageSize >= totalQuestions} onClick={nextPage}>
            Próxima
          </button>
        </div>
      </article>

      <article className="card">
        <AnswerGrid
          prova={prova}
          answers={answers}
          onAnswersChange={onAnswersChange}
          pageStart={pageStart}
          pageEnd={pageEnd}
          autoAdvanceToNextPage={() => {
            if (page * pageSize < totalQuestions) {
              setPage((p) => p + 1);
            }
          }}
        />
      </article>
    </section>
  );
}
