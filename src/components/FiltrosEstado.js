import React from 'react';
import { Button } from '@mui/material';
import styles from '@/styles/global/misTrabajos.module.css';

const FiltrosEstado = ({ estadoFiltro, setEstadoFiltro }) => {
  const estados = ['TODOS', 'PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'EN_REVISION', 'PUBLICADO', 'EN_PROCESO', 'FINALIZADO', 'CALIFICADO'];

  return (
    <div className={styles.filterButtonsContainer}>
      {estados.map((estado, index) => (
        <Button
          key={index}
          onClick={() => setEstadoFiltro(estado)}
          variant={estadoFiltro === estado ? 'contained' : 'text'}
          className={estadoFiltro === estado ? styles.activeFilterButton : styles.filterButton}
        >
          {estado} (0)
        </Button>
      ))}
    </div>
  );
};

export default FiltrosEstado;
