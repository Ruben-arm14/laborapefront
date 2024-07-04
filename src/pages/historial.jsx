import React, { useState, useEffect, useContext } from 'react';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { Box, Grid, Tabs, Tab } from '@mui/material';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/historial.module.css';

const Historial = () => {
  const { user } = useContext(AppContext);
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.idfreelancer) {
      const fetchHistorial = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/freelancer/${user.idfreelancer}`);
          if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
          }
          const data = await response.json();
          setHistorial(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchHistorial();
    }
  }, [user]);

  const handleFiltroChange = (event, newValue) => {
    setFiltro(newValue);
  };

  const filteredHistorial = historial.filter(item => filtro === 'todos' || item.estado === filtro);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <LogoBarFreelance />
      <h1 className={styles.title}>Historial</h1>
      <Tabs value={filtro} onChange={handleFiltroChange} className={styles.tabs}>
        <Tab label="Todos" value="todos" />
        <Tab label="En Proceso" value="EN_PROCESO" />
        <Tab label="Terminado" value="TERMINADO" />
      </Tabs>
      <Box className={styles.historialContainer}>
        <Grid container spacing={2} direction="column">
          {filteredHistorial.map((historialItem) => (
            <Grid item key={historialItem.id} className={styles.historialItem}>
              {historialItem.trabajo.imagen ? (
                <img
                  src={`data:image/jpeg;base64,${historialItem.trabajo.imagen}`}
                  alt={historialItem.trabajo.titulo}
                  className={styles.trabajoImage}
                />
              ) : (
                <p>Imagen no disponible.</p>
              )}
              <div className={styles.historialDetails}>
                <h2>{historialItem.trabajo.titulo}</h2>
                <p>{historialItem.trabajo.descripcion}</p>
                <p><strong>Ubicación:</strong> {historialItem.trabajo.ubicacion}</p>
                <p><strong>Fecha:</strong> {historialItem.trabajo.fecha}</p>
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
