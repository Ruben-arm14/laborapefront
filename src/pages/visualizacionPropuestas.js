import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Container } from '@mui/material';
import LogoBar from '@/components/layout/LogoBar';
import styles from '@/styles/global/verPropuestas.module.css';
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.bodyNoMargin}>
      <LogoBar />
      <Container className={styles.pageContainer}>
        <h1 className={styles.subtitle}>Propuestas</h1>
        <Box className={styles.propuestasWrapper}>
          <Grid container spacing={4} direction="column">
            {propuestas.map((propuesta, index) => (
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
                    <p><strong>Nombre:</strong> {propuesta.freelancer.usuario.nombre}</p>
                    <p><strong>Edad:</strong> {propuesta.freelancer.usuario.edad}</p>
                    <p><strong>Habilidades:</strong> {propuesta.freelancer.habilidades}</p>
                    <p><strong>Disponibilidad:</strong> {propuesta.disponibilidad}</p>
                    <p><strong>Comentario:</strong> {propuesta.mensaje}</p>
                  </div>
                </div>
                <div className={styles.trabajoDetails}>
                  <h4><strong>Trabajo:</strong> {propuesta.trabajo.titulo}</h4>
                  <p><strong>Presupuesto:</strong> {propuesta.presupuesto}</p>
                </div>
                <div className={styles.buttonsContainer}>
                  <button className={styles.acceptButton}>ACEPTAR</button>
                  <button className={styles.rejectButton}>RECHAZAR</button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default VerPropuestas;
