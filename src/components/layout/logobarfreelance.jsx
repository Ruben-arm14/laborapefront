import React from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/global/LogoBarFreelance.module.css';

const LogoBarFreelance = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Logic for logging out
    router.push('/login');
  };

  return (
    <div className={styles.logoBar}>
      <div className={styles.logo}>
        <img src={`/imagenes/Labora.png`} className={styles.logoImage} />
      </div>
      <nav>
        <ul className={styles.navList}>
          <li className={`${styles.navItem} ${router.pathname === '/trabajosFreelancer' ? styles.active : ''}`}>
            <a onClick={() => router.push('/trabajosFreelancer')}>Trabajos</a>
          </li>
          <li className={`${styles.navItem} ${router.pathname === '/propuestas' ? styles.active : ''}`}>
            <a onClick={() => router.push('/propuestas')}>Mis Postulaciones</a>
          </li>
          <li className={`${styles.navItem} ${router.pathname === '/historial' ? styles.active : ''}`}>
            <a onClick={() => router.push('/historial')}>Historial</a>
          </li>
          <li className={`${styles.navItem} ${router.pathname === '/perfil' ? styles.active : ''}`}>
            <a onClick={() => router.push('/perfil')}>Perfil</a>
          </li>
        </ul>
      </nav>
      <div className={styles.userActions}>
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default LogoBarFreelance;
