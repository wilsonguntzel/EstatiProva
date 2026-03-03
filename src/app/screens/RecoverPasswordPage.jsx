import { useParams } from 'react-router-dom';

export default function RecoverPasswordPage() {
  const { token } = useParams();
  return <p>Recuperação com token: {token}</p>;
}
