import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProvas } from '../../services/apiClient';

export default function HomePage() {
  const nav = useNavigate();
  const userId = localStorage.getItem('userId');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getMyProvas(userId);
        setItems(data.exams || data.provas || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return (
    <section className="grid-gap">
      <h2>Minhas provas</h2>
      {!userId ? (
        <article className="card">
          <p className="muted">Defina seu perfil para salvar respostas e resultados.</p>
          <button type="button" className="primary" onClick={() => nav('/perfil')}>Configurar perfil</button>
        </article>
      ) : (
        <article className="card">
          {loading ? <p>Carregando...</p> : null}
          {!loading && items.length === 0 ? <p className="muted">Você ainda não respondeu nenhuma prova.</p> : null}
          <div className="grid-gap">
            {items.map((it) => {
              const id = it.exam?._id || it.examId;
              return (
                <div key={id} className="list-row">
                  <div>
                    <strong>{it.exam?.orgao || 'Prova'}</strong>
                    <p className="muted">{it.exam?.cargo} • {it.exam?.nomeProva}</p>
                  </div>
                  <div className="row">
                    <button type="button" onClick={() => nav(`/provas/${id}/responder`)}>Responder</button>
                    <button type="button" onClick={() => nav(`/provas/${id}/resultado`)}>Resultado</button>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      )}
      <article className="card">
        <button type="button" onClick={() => nav('/provas')}>Explorar provas</button>
      </article>
    </section>
  );
}
