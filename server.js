import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import permissionsPolicy from 'permissions-policy';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiOrigin = process.env.API_ORIGIN || '';
const imgOrigin = process.env.IMG_ORIGIN || '';

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", apiOrigin].filter(Boolean),
        imgSrc: ["'self'", 'data:', imgOrigin].filter(Boolean),
      },
    },
  })
);

app.use(
  permissionsPolicy({
    features: {
      geolocation: [],
      camera: [],
      microphone: [],
    },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: 'Credenciais inválidas' });
  }
  return res.json({ token: 'token-fake' });
});

app.post('/login/valida_token', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token ausente' });
  }
  return res.json({ usuario: { nome: 'Usuário', imagemUsuario: 'img/template/avatar.png' } });
});

const distPath = path.join(__dirname, 'dist');
app.use(
  express.static(distPath, {
    immutable: true,
    maxAge: '1y',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 4173;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
