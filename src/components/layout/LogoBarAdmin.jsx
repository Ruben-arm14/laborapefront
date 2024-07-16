import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/logobaradmin.module.css';

const LogoBarAdmin = () => {
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
          alt="LaboraPE Logo"
          className={styles.logoImage}
        />
      </div>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={router.pathname === '/trabajosadmin' ? styles.active : ''}>
            <a href="http://localhost:3000/trabajosadmin">Trabajos Enviados</a>
          </li>
        </ul>
      </nav>
      <div className={styles.userActions}>
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default LogoBarAdmin;
