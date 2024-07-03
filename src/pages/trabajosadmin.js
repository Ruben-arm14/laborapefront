import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Button, Alert } from '@mui/material';
import LogoBarAdmin from '@/components/layout/LogoBarAdmin';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/vertrabajos.module.css';

const TrabajosAdmin = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("Usuario almacenado:", parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    console.log("Usuario actual:", user);
    if (user && user.rol === 'ADMIN') {
      fetchTrabajosEnRevision();
    } else {
      setError("No tienes permisos para ver esta página.");
    }
  }, [user]);

  const fetchTrabajosEnRevision = async () => {
    try {
      const response = await fetch('http://localhost:8080/trabajos/estado/EN_REVISION');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener trabajos en revisión');
      }
      const data = await response.json();
      setTrabajos(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApprove = async (trabajoId) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajoId}/aprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al aprobar trabajo');
      }
      const result = await response.json();
      setAlerta(result.message);
      fetchTrabajosEnRevision();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDisapprove = async (trabajoId) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajoId}/desaprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al desaprobar trabajo');
      }
      const result = await response.json();
      setAlerta(result.message);
      fetchTrabajosEnRevision();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <LogoBarAdmin />
      <div className={styles.container}>
        <h1 className={styles.title}>Trabajos Enviados</h1>
        {error && <p className={styles.error}>{error}</p>}
        {alerta && <Alert severity="success">{alerta}</Alert>}
        <Box className={styles.trabajosWrapper}>
          <Grid container spacing={2} justifyContent="center">
            {trabajos.map((trabajo, index) => (
              <Grid item key={index} className={styles.trabajoItem}>
                <div className={styles.trabajoDetails}>
                  <img src={trabajo.imagenUrl || "https://via.placeholder.com/150"} alt={trabajo.titulo} className={styles.trabajoImage} />
                  <h2 className={styles.trabajoTitle}>{trabajo.titulo}</h2>
                  <p className={styles.trabajoDescription}>{trabajo.descripcion}</p>
                  <p className={styles.trabajoInfo}>Ubicación: {trabajo.ubicacion}</p>
                  <p className={styles.trabajoInfo}>Presupuesto: {trabajo.presupuesto}</p>
                  <p className={styles.trabajoInfo}>Fecha Límite: {trabajo.fechaLimite}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.approveButton}
                    onClick={() => handleApprove(trabajo.idtrabajo)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={styles.disapproveButton}
                    onClick={() => handleDisapprove(trabajo.idtrabajo)}
                  >
                    Desaprobar
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default TrabajosAdmin;
