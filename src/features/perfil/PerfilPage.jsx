import { useAuthContext } from '../../auth/useAuthContext';
import { normalizeImgSrc } from '../../utils/normalizeImgSrc';

export default function PerfilPage() {
  const { usuario } = useAuthContext();

  return (
    <div>
      <p>Perfil</p>
      <img src={normalizeImgSrc(usuario?.imagemUsuario || 'img/template/avatar.png')} alt="Avatar" width="80" />
    </div>
  );
}
