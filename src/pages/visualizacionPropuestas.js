import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Container, Typography, Button, CircularProgress, Alert } from '@mui/material';
import LogoBar from '@/components/layout/LogoBar';
import styles from '@/styles/global/verpropuestascliente.module.css';
import { AppContext } from '@/context/AppContext';

const VerPropuestas = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);

  useEffect(() => {
    if (user && user.idusuario) {
      const clienteId = sessionStorage.getItem('idcliente');
      console.log("Fetching propuestas for clienteId:", clienteId);
      const fetchPropuestas = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Data received from backend:", data);
          setPropuestas(data);
        } catch (error) {
          console.error('Error fetching postulaciones:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchPropuestas();
    }
  }, [user]);

  const handleAceptar = async (propuestaId) => {
    const confirm = window.confirm("¿Seguro que desea aceptar la postulación? Se rechazarán las demás postulaciones en caso tengas activo.");
    if (confirm) {
      try {
        const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}/aceptar`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Volver a cargar las propuestas
        const clienteId = sessionStorage.getItem('idcliente');
        const fetchPropuestas = async () => {
          try {
            const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPropuestas(data.filter(propuesta => propuesta.estado === 'PENDIENTE'));
          } catch (error) {
            console.error('Error fetching postulaciones:', error);
            setError(error);
          }
        };
        fetchPropuestas();
      } catch (error) {
        console.error('Error accepting postulacion:', error);
        setError(error);
      }
    }
  };

  const handleRechazar = async (propuestaId) => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}/rechazar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Volver a cargar las propuestas
      const clienteId = sessionStorage.getItem('idcliente');
      const fetchPropuestas = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setPropuestas(data.filter(propuesta => propuesta.estado === 'PENDIENTE'));
        } catch (error) {
          console.error('Error fetching postulaciones:', error);
          setError(error);
        }
      };
      fetchPropuestas();
    } catch (error) {
      console.error('Error rejecting postulacion:', error);
      setError(error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.bodyNoMargin}>
      <LogoBar />
      <Container className={styles.pageContainer}>
        <Typography variant="h4" className={styles.subtitle}>Propuestas</Typography>
        <Box className={styles.propuestasWrapper}>
          {propuestas.length === 0 ? (
            <Alert severity="info">Por el momento no tienes propuestas</Alert>
          ) : (
            <Grid container spacing={4} direction="column">
              {propuestas
                .filter(propuesta => propuesta.estado === 'PENDIENTE')
                .map((propuesta, index) => (
                  <Grid item key={index} className={styles.propuestaItem}>
                    <div className={styles.freelancerInfo}>
                      <div className={styles.freelancerImageWrapper}>
                        <img 
                          src={`http://localhost:8080/postulaciones/freelancers/${propuesta.freelancer.usuario.idusuario}/imagen`} 
                          alt={propuesta.freelancer.usuario.nombre} 
                          className={styles.freelancerImage} 
                        />
                      </div>
                      <div className={styles.freelancerDetails}>
                        <Typography variant="h6">{propuesta.freelancer.usuario.nombre}</Typography>
                        <Typography variant="body1"><strong>Edad:</strong> {propuesta.freelancer.usuario.edad}</Typography>
                        <Typography variant="body1"><strong>Habilidades:</strong> {propuesta.freelancer.habilidades}</Typography>
                        <Typography variant="body1"><strong>Disponibilidad:</strong> {propuesta.disponibilidad}</Typography>
                        <Typography variant="body1"><strong>Comentario:</strong> {propuesta.mensaje}</Typography>
                      </div>
                    </div>
                    <div className={styles.trabajoDetails}>
                      <Typography variant="h6"><strong>Trabajo:</strong> {propuesta.trabajo.titulo}</Typography>
                      <Typography variant="body1"><strong>Presupuesto:</strong> {propuesta.presupuesto}</Typography>
                    </div>
                    <div className={styles.buttonsContainer}>
                      <Button variant="contained" color="primary" onClick={() => handleAceptar(propuesta.id)}>Aceptar</Button>
                      <Button variant="contained" color="secondary" onClick={() => handleRechazar(propuesta.id)}>Rechazar</Button>
                    </div>
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default VerPropuestas;
