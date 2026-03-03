const baseHeaders = { 'Content-Type': 'application/json' };

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { ...baseHeaders, ...(options.headers || {}) },
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const error = new Error(data?.error || 'Erro de requisição');
    error.response = { data };
    throw error;
  }

  return data;
}

export async function createOrGetUser(payload) {
  return request('/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function listProvas() {
  return request('/provas');
}

export async function getProva(provaId) {
  return request(`/provas/${provaId}`);
}

export async function upsertSubmission(params) {
  const { provaId, ...body } = params;
  return request(`/provas/${provaId}/submissions`, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function getPrediction(provaId, userId) {
  return request(`/provas/${provaId}/prediction/${userId}`);
}

export async function getMyProvas(userId) {
  return request(`/users/${userId}/provas`);
}
