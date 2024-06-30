import React, { useState, useEffect } from 'react';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import styles from '@/styles/global/historial.module.css';

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    // Aquí se haría la llamada a la API para obtener el historial
    setHistorial([
      { id: 1, titulo: "Trabajo 1", descripcion: "Descripción del trabajo 1", ubicacion: "Lima, Perú", fecha: "2023-01-01", presupuesto: "$1000", estado: "Nuevo" },
      { id: 2, titulo: "Trabajo 2", descripcion: "Descripción del trabajo 2", ubicacion: "Arequipa, Perú", fecha: "2023-02-01", presupuesto: "$2000", estado: "En Proceso" },
      { id: 3, titulo: "Trabajo 3", descripcion: "Descripción del trabajo 3", ubicacion: "Cusco, Perú", fecha: "2023-03-01", presupuesto: "$3000", estado: "Terminado" },
    ]);
  }, []);

  const handleFiltroChange = (event, newValue) => {
    setFiltro(newValue);
  };

  const filteredHistorial = historial.filter(item => filtro === 'todos' || item.estado === filtro);

  return (
    <div className={styles.container}>
      <LogoBarFreelance />
      <h1 className={styles.title}>Historial</h1>
      <Tabs value={filtro} onChange={handleFiltroChange} className={styles.tabs}>
        <Tab label="Todos" value="todos" />
        <Tab label="Nuevo" value="Nuevo" />
        <Tab label="En Proceso" value="En Proceso" />
        <Tab label="Terminado" value="Terminado" />
      </Tabs>
      <Box className={styles.historialContainer}>
        <Grid container spacing={2} direction="column">
          {filteredHistorial.map((historialItem) => (
            <Grid item key={historialItem.id} className={styles.historialItem}>
              <img src="https://via.placeholder.com/150" alt={historialItem.titulo} className={styles.trabajoImage} />
              <div className={styles.historialDetails}>
                <h2>{historialItem.titulo}</h2>
                <p>{historialItem.descripcion}</p>
                <p><strong>Ubicación:</strong> {historialItem.ubicacion}</p>
                <p><strong>Fecha:</strong> {historialItem.fecha}</p>
                <p><strong>Presupuesto:</strong> {historialItem.presupuesto}</p>
                <p><strong>Estado:</strong> {historialItem.estado}</p>
              </div>
              <button className={styles.resenaButton}>Escribir Reseña</button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Historial;
