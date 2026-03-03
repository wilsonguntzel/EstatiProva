import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../auth/useAuthContext';

export default function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', senha: '', lembrar: false });

  async function onSubmit(event) {
    event.preventDefault();
    await login(form);
    navigate('/home');
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      <input
        placeholder="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
      />
      <input
        placeholder="senha"
        type="password"
        value={form.senha}
        onChange={(event) => setForm((prev) => ({ ...prev, senha: event.target.value }))}
      />
      <label>
        <input
          type="checkbox"
          checked={form.lembrar}
          onChange={(event) => setForm((prev) => ({ ...prev, lembrar: event.target.checked }))}
        />
        Lembrar
      </label>
      <button type="submit">Entrar</button>
    </form>
  );
}
