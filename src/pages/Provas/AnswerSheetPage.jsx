import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { debounce } from '../../utils/debounce';
import { parseAnswersFromText } from '../../utils/parseAnswers';
import { getProva, upsertSubmission } from '../../services/apiClient';

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
      const p = await getProva(provaId);
      setProva(p);
      setBookletType((curr) => curr || p.tipoProva?.[0] || 'UNICA');
      setAnswers(Array.from({ length: p.questoes.length }, () => null));
    })();
  }, [provaId]);

  const saveDebounced = useMemo(() => debounce(async (nextAnswers) => {
    if (!userId || !prova) return;
    setSaving(true);
    try {
      const data = await upsertSubmission({ provaId: prova._id, userId, bookletType, answers: nextAnswers });
      setSub(data);
    } finally {
      setSaving(false);
    }
  }, 700), [userId, prova, bookletType]);

  const currentSlice = useMemo(() => {
    if (!prova) return [];
    const start = (page - 1) * pageSize;
    return prova.questoes.slice(start, start + pageSize);
  }, [prova, page]);

  if (!prova) return <article className="card">Carregando...</article>;

  return (
    <section className="grid-gap">
      <article className="card">
        <h2>Responder</h2>
        <p className="muted">{prova.orgao} • {prova.cargo} • {prova.nomeProva}</p>
        <div className="row wrap">
          <select value={bookletType} onChange={(e) => { setBookletType(e.target.value); saveDebounced(answers); }}>
            {prova.tipoProva.map((t) => <option key={t} value={t}>Tipo {t}</option>)}
          </select>
          <button type="button" onClick={() => {
            const text = window.prompt('Cole as respostas (ex: A B C - D ...):');
            if (!text) return;
            const parsed = parseAnswersFromText(text, prova.questoes.length);
            setAnswers(parsed);
            saveDebounced(parsed);
          }}>Colar respostas</button>
          <button type="button" className="primary" onClick={() => nav(`/provas/${prova._id}/resultado`)}>Ver resultado</button>
        </div>
        <div className="row wrap">
          <span className="pill">Questões: {prova.questoes.length}</span>
          <span className="pill">{saving ? 'Salvando...' : 'Salvo'}</span>
          {sub ? <span className="pill">Gabarito: {sub.keyStageApplied}</span> : null}
        </div>
      </article>
      <article className="card">
        <div className="row between">
          <strong>Página {page}</strong>
          <div className="row">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
            <button type="button" disabled={page * pageSize >= prova.questoes.length} onClick={() => setPage((p) => p + 1)}>Próxima</button>
          </div>
        </div>
        <div className="grid-gap">
          {currentSlice.map((questao, localIdx) => {
            const idxGlobal = (page - 1) * pageSize + localIdx;
            return (
              <div key={idxGlobal} className="list-row">
                <span><strong>Q{idxGlobal + 1}</strong> <span className="muted">({questao.disciplinaKey})</span></span>
                <select
                  value={answers[idxGlobal] || ''}
                  onChange={(e) => {
                    const next = answers.slice();
                    next[idxGlobal] = e.target.value || null;
                    setAnswers(next);
                    saveDebounced(next);
                  }}
                >
                  <option value="">Branco</option>
                  {questao.respostas.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}
