import { requestJson } from '../services/http/apiClient';

export async function loginRequest({ email, senha }) {
  return requestJson('/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function validateToken(token) {
  return requestJson('/login/valida_token', {
    method: 'POST',
    headers: { authorization: token },
  });
}
