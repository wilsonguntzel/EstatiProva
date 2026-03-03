import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <h1>Landing</h1>
      <Link to="/login">Ir para login</Link>
    </div>
  );
}
