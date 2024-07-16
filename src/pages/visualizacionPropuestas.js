import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Container, Typography, Button, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import LogoBar from '@/components/layout/LogoBar';
import styles from '@/styles/global/verpropuestascliente.module.css';
import { AppContext } from '@/context/AppContext';

const VerPropuestas = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AppContext);
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedPropuestaId, setSelectedPropuestaId] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    if (user && user.idusuario) {
      const clienteId = sessionStorage.getItem('clienteId');
      console.log("Fetching propuestas for clienteId:", clienteId);
      const fetchPropuestas = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Data received from backend:", data);
          const filteredData = data.filter(propuesta => propuesta.estado === 'PENDIENTE');
          setPropuestas(filteredData);

          const uniqueCategories = [...new Set(filteredData.map(propuesta => propuesta.trabajo.categoria))];
          setCategories(uniqueCategories);
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

  const handleAceptar = async () => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${selectedPropuestaId}/aceptar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const clienteId = sessionStorage.getItem('clienteId');
      const fetchPropuestas = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const filteredData = data.filter(propuesta => propuesta.estado === 'PENDIENTE');
          setPropuestas(filteredData);
          const uniqueCategories = [...new Set(filteredData.map(propuesta => propuesta.trabajo.categoria))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Error fetching postulaciones:', error);
          setError(error);
        }
      };
      fetchPropuestas();
    } catch (error) {
      console.error('Error accepting postulacion:', error);
      setError(error);
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleRechazar = async () => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${selectedPropuestaId}/rechazar`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const clienteId = sessionStorage.getItem('clienteId');
      const fetchPropuestas = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const filteredData = data.filter(propuesta => propuesta.estado === 'PENDIENTE');
          setPropuestas(filteredData);
          const uniqueCategories = [...new Set(filteredData.map(propuesta => propuesta.trabajo.categoria))];
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Error fetching postulaciones:', error);
          setError(error);
        }
      };
      fetchPropuestas();
    } catch (error) {
      console.error('Error rejecting postulacion:', error);
      setError(error);
    } finally {
      setConfirmOpen(false);
    }
  };

  const openConfirmDialog = (propuestaId, action) => {
    setSelectedPropuestaId(propuestaId);
    setActionType(action);
    setConfirmMessage(
      action === 'accept' 
        ? '¿Seguro que desea aceptar la postulación? Se rechazarán las demás postulaciones en caso tengas activo.'
        : '¿Seguro que desea rechazar la postulación?'
    );
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (actionType === 'accept') {
      handleAceptar();
    } else if (actionType === 'reject') {
      handleRechazar();
    }
  };

  const handleFilterChange = (newValue) => {
    setFilter(newValue);
  };

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.bodyNoMargin}>
      <LogoBar />
      <Container className={styles.pageContainer}>
        <Typography variant="h4" className={styles.subtitle}>Propuestas</Typography>
        <Box className={styles.filterContainer}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${styles.filtroButton} ${filter === category ? styles.active : ''}`}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </button>
          ))}
        </Box>
        <Box className={styles.propuestasWrapper}>
          {propuestas.length === 0 ? (
            <Alert severity="info">Por el momento no tienes propuestas</Alert>
          ) : (
            <Grid container spacing={4}>
              {propuestas
                .filter(propuesta => filter === '' || propuesta.trabajo.categoria === filter)
                .map((propuesta, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <div className={styles.propuestaCard}>
                      <div className={styles.cardHeader}>
                        <img 
                          src={`http://localhost:8080/postulaciones/freelancers/${propuesta.freelancer.usuario.idusuario}/imagen`} 
                          alt={propuesta.freelancer.usuario.nombre} 
                          className={styles.freelancerImage} 
                        />
                      </div>
                      <div className={styles.cardBody}>
                        <Typography variant="h6" className={styles.centerText}>{propuesta.freelancer.usuario.nombre}</Typography>
                        <Typography variant="body2"><strong>Edad:</strong> {propuesta.freelancer.usuario.edad}</Typography>
                        <Typography variant="body2"><strong>Habilidades:</strong> {propuesta.freelancer.habilidades}</Typography>
                        <Typography variant="body2"><strong>Disponibilidad:</strong> {propuesta.disponibilidad}</Typography>
                        <Typography variant="body2"><strong>Comentario:</strong> {propuesta.mensaje}</Typography>
                        <Typography variant="body2"><strong>Categoria:</strong> {propuesta.trabajo.categoria}</Typography>
                      </div>
                      <div className={styles.cardFooter}>
                        <Typography variant="body2" className={styles.inlineText}><strong>Trabajo:</strong> {propuesta.trabajo.titulo}</Typography>
                        <Typography variant="body2" className={styles.inlineText}><strong>Presupuesto:</strong> {propuesta.presupuesto}</Typography>
                      </div>
                      <div className={styles.cardFooter}>
                        <Button variant="contained" color="primary" onClick={() => openConfirmDialog(propuesta.id, 'accept')}>Aceptar</Button>
                        <Button variant="contained" color="secondary" onClick={() => openConfirmDialog(propuesta.id, 'reject')}>Rechazar</Button>
                      </div>
                    </div>
                  </Grid>
                ))}
            </Grid>
          )}
        </Box>
      </Container>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Typography>{confirmMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VerPropuestas;
