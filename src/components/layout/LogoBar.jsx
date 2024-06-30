import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/LogoBar.module.css';

const LogoBar = () => {
  const { setUser } = useContext(AppContext);
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  return (
    <div className={styles.logoBar}>
      <div className={styles.logo}>
        <img
          src={`/imagenes/Labora.png`}
          className={styles.logoImage}
        />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={router.pathname === '/publicacion' ? styles.active : ''}>
            <a href="/publicacion">Publica tu actividad</a>
          </li>
          <li className={router.pathname === '/visualizacionPropuestas' ? styles.active : ''}>
            <a href="/visualizacionPropuestas">Ver Propuestas</a>
          </li>
          <li className={router.pathname === '/MisTrabajos' ? styles.active : ''}>
            <a href="/MisTrabajos">Mis Trabajos</a>
          </li>
          <li className={router.pathname === '/perfilcliente' ? styles.active : ''}>
            <a href="/perfilcliente">Perfil</a>
          </li>
        </ul>
      </nav>
      <div className={styles.userActions}>
        <a href="#" onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</a>
      </div>
    </div>
  );
};

export default LogoBar;
