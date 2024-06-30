import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Alert, Button, Snackbar } from '@mui/material';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/verPropuestas.module.css';

const Propuestas = () => {
  const { user } = useContext(AppContext);
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPropuestas = async () => {
      if (!user) {
        setError("Debes iniciar sesión para ver tus postulaciones.");
        return;
      }
      try {
        const response = await fetch(`http://localhost:8080/postulaciones/freelancer/${user.idusuario}`);
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        setPropuestas(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPropuestas();
  }, [user]);

  const handleCancel = async (propuestaId) => {
    console.log(`Eliminando postulación con ID: ${propuestaId}`); // Verificar el ID
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete postulación');
      }
      setPropuestas(propuestas.filter(propuesta => propuesta.trabajoId !== propuestaId));
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <LogoBarFreelance />
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Postulaciones</h1>
        <Box className={styles.propuestasWrapper}>
          {error && <Alert severity="error">{error}</Alert>}
          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            message="Postulación eliminada correctamente"
          />
          <Grid container spacing={2} justifyContent="center">
            {propuestas.length > 0 ? (
              propuestas.map((propuesta, index) => (
                <Grid item key={index} className={styles.propuestaItem}>
                  <div className={styles.propuestaDetails}>
                    {propuesta.imagenBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${propuesta.imagenBase64}`}
                        alt={propuesta.tituloTrabajo}
                        className={styles.trabajoImage}
                      />
                    ) : (
                      <p>Imagen no disponible.</p>
                    )}
                    <h2 className={styles.trabajoTitle}>{propuesta.tituloTrabajo}</h2>
                    <p className={styles.trabajoDescription}>{propuesta.descripcionTrabajo}</p>
                    <p><strong>Mensaje:</strong> {propuesta.mensaje}</p>
                    <p><strong>Presupuesto:</strong> {propuesta.presupuesto}</p>
                    <p><strong>Estado:</strong> {propuesta.estadoTrabajo}</p>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={styles.cancelButton}
                      onClick={() => handleCancel(propuesta.trabajoId)}
                    >
                      CANCELAR POSTULACIÓN
                    </Button>
                  </div>
                </Grid>
              ))
            ) : (
              <p>Datos del trabajo no disponibles.</p>
            )}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Propuestas;
