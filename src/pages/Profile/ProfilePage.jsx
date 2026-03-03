import { useState } from 'react';
import { createOrGetUser } from '../../services/apiClient';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [feedback, setFeedback] = useState('');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const onSave = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      const user = await createOrGetUser({ email: email || undefined, login: login || undefined });
      localStorage.setItem('userId', user._id);
      setUserId(user._id);
      setFeedback('Perfil salvo com sucesso.');
    } catch (error) {
      setFeedback(error?.response?.data?.error || 'Erro ao salvar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid-gap">
      <h2>Perfil</h2>
      <article className="card">
        <p className="muted">Informe um email ou login para vincular suas respostas (sem autenticação por enquanto).</p>
        <form className="grid-gap" onSubmit={onSave}>
          <label>Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" />
          </label>
          <label>Login/Nickname
            <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="candidato123" />
          </label>
          <div className="row">
            <button type="submit" className="primary" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
            <span className="muted">UserId: {userId || 'não definido'}</span>
          </div>
          {feedback ? <p>{feedback}</p> : null}
        </form>
      </article>
    </section>
  );
}
