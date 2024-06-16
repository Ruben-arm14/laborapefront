import React from 'react';

const LogoBarFreelance = () => {
  return (
    <div className="logo-bar">
      {/* Logo */}
      <div className="logo">
        <img src={`/imagenes/Labora.png`} style={{ width: '150px', height: '70px', objectFit: 'cover' }} />
      </div>

      {/* Enlaces de Navegación */}
      <nav>
        <ul>
          <li>
            <a href="http://localhost:3000/propuestas">Ver trabajos</a>
          </li>
          <li>
            <a href="http://localhost:3000/propuestas">Mis Perfil tecnico</a>
          </li>
          <li>
            <a href="#">Mis Trabajos</a>
          </li>
        </ul>
      </nav>

      {/* Acciones de Usuario */}
      <div className="user-actions">
        <a href="#">Cerrar Sesión</a>
      </div>
    </div>
  );
};

export default LogoBarFreelance;