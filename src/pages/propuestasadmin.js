import React, { useEffect, useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import LogoBarAdmin from '@/components/layout/logobaradmin';
import styles from '@/styles/global/verpropuestasadmin.module.css';

const PropuestasAdmin = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPropuestas();
  }, []);

  const fetchPropuestas = async () => {
    try {
      const response = await fetch('http://localhost:8080/postulaciones/estado/enviada');
      if (!response.ok) {
        throw new Error('Error al obtener propuestas enviadas');
      }
      const data = await response.json();
      setPropuestas(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApprove = async (propuestaId) => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}/aprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Error al aprobar propuesta');
      }
      alert("Propuesta aprobada exitosamente.");
      fetchPropuestas();
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleDisapprove = async (propuestaId) => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}/desaprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error('Error al desaprobar propuesta');
      }
      fetchPropuestas();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <LogoBarAdmin />
      <div className={styles.container}>
        <h1 className={styles.title}>Propuestas Enviadas</h1>
        {error && <p className={styles.error}>{error}</p>}
        <Box className={styles.propuestasWrapper}>
          <Grid container spacing={2} justifyContent="center">
            {propuestas.map((propuesta, index) => (
              <Grid item key={index} className={styles.propuestaItem}>
                <div className={styles.propuestaDetails}>
                  <img src={`data:image/jpeg;base64,${propuesta.imagenBase64}`} alt={propuesta.tituloTrabajo} className={styles.trabajoImage} />
                  <h2 className={styles.trabajoTitle}>{propuesta.tituloTrabajo}</h2>
                  <p className={styles.trabajoDescription}>{propuesta.descripcionTrabajo}</p>
                  <p className={styles.propuestaMensaje}><strong>Mensaje:</strong> {propuesta.mensaje}</p>
                  <p className={styles.propuestaPresupuesto}><strong>Presupuesto:</strong> {propuesta.presupuesto}</p>
                  <p className={styles.propuestaFreelancer}><strong>Freelancer:</strong> {propuesta.nombreFreelancer}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.approveButton}
                    onClick={() => handleApprove(propuesta.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={styles.disapproveButton}
                    onClick={() => handleDisapprove(propuesta.id)}
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

export default PropuestasAdmin;
