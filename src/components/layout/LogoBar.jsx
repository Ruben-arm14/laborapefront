import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/context/AppContext';

const LogoBar = () => {
  const { setUser } = useContext(AppContext);
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  return (
    <div className="logo-bar">
      {/* Logo */}
      <div className="logo">
        <img
          src={`/imagenes/Labora.png`}
          style={{ width: "150px", height: "70px", objectFit: "cover" }}
        />
      </div>

      {/* Enlaces de Navegación */}
      <nav>
        <ul>
          <li>
            <a href="http://localhost:3000/publicacion">Publica tu actividad</a>
          </li>
          <li>
            <a href="http://localhost:3000/visualizacionPropuestas">
              Ver Propuestas
            </a>
          </li>
          <li>
            <a href="#">Mis Trabajos</a>
          </li>
        </ul>
      </nav>

      {/* Acciones de Usuario */}
      <div className="user-actions">
        <a href="#" onClick={handleLogout}>Cerrar Sesión</a> {/* Mantener el estilo de enlace */}
      </div>
    </div>
  );
};

export default LogoBar;
