import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPrediction, getProva } from '../../services/apiClient';

function Donut({ percent }) {
  const p = Math.max(0, Math.min(100, percent));
  return <div className="donut" style={{ background: `conic-gradient(#4f46e5 ${p}%, #e5e7eb 0)` }}><span>{p.toFixed(1)}%</span></div>;
}

function RangeBar({ low, high, total }) {
  const left = (low / total) * 100;
  const width = ((high - low) / total) * 100;
  return <div className="range-track"><div className="range-bar" style={{ left: `${left}%`, width: `${Math.max(2, width)}%` }} /></div>;
}

export default function ResultPage() {
  const { provaId } = useParams();
  const nav = useNavigate();
  const userId = localStorage.getItem('userId');
  const [prova, setProva] = useState(null);
  const [pred, setPred] = useState(null);

  useEffect(() => {
    (async () => {
      if (!userId) return nav('/perfil');
      const p = await getProva(provaId);
      setProva(p);
      setPred(await getPrediction(provaId, userId));
    })();
  }, [provaId, userId, nav]);

  if (!prova || !pred) return <article className="card">Carregando...</article>;

  const probStage2 = pred.cutStage2 ? pred.cutStage2.probAbove * 100 : null;
  const probFinal = pred.cutFinal ? pred.cutFinal.probAbove * 100 : null;

  return (
    <section className="grid-gap">
      <article className="card">
        <h2>Resultado estimado</h2>
        <p className="muted">{prova.orgao} • {prova.cargo} • {prova.nomeProva}</p>
        <div className="row wrap">
          <span className="pill">Rank est.: {pred.estimatedRank}</span>
          <span className="pill">Faixa 90%: {pred.ci90.low} – {pred.ci90.high}</span>
          <span className="pill">Percentil: {(pred.percentile * 100).toFixed(1)}%</span>
        </div>
        <div className="row wrap">
          <button type="button" onClick={() => nav(`/provas/${prova._id}/responder`)}>Editar respostas</button>
          <button type="button" onClick={() => nav(`/provas/${prova._id}`)}>Voltar</button>
        </div>
      </article>

      <div className="cards-grid">
        <article className="card">
          <h3>Probabilidade acima do corte (2ª etapa)</h3>
          {probStage2 === null ? <p className="muted">Sem vagas de 2ª etapa.</p> : <Donut percent={probStage2} />}
        </article>
        <article className="card">
          <h3>Probabilidade acima do corte (final)</h3>
          {probFinal === null ? <p className="muted">Sem vagas finais.</p> : <Donut percent={probFinal} />}
        </article>
        <article className="card">
          <h3>Intervalo de classificação (CI90)</h3>
          <RangeBar low={pred.ci90.low} high={pred.ci90.high} total={Math.max(pred.totalCandidates, pred.ci90.high)} />
          <p className="muted">Quanto menor o rank, melhor.</p>
        </article>
      </div>
    </section>
  );
}
