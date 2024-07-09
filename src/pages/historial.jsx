import React, { useState, useEffect, useContext } from 'react';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { Box, Grid, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/historial.module.css';
import Rating from '@mui/material/Rating';

const Historial = () => {
  const { user, freelancerId } = useContext(AppContext);
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCalificacion, setOpenCalificacion] = useState(false);
  const [calificacionInfo, setCalificacionInfo] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);

  useEffect(() => {
    if (user && freelancerId) {
      const fetchHistorial = async () => {
        try {
          const response = await fetch(`http://localhost:8080/postulaciones/freelancer/${freelancerId}`);
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
  }, [user, freelancerId]);

  const handleFiltroChange = (event, newValue) => {
    setFiltro(newValue);
  };

  const handleViewContact = async (trabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/cliente/${trabajo.trabajo.cliente.idcliente}/detalle`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      const clienteData = await response.json();
      setClienteInfo(clienteData);
      setOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setClienteInfo(null);
  };

  const handleViewCalificacion = async (trabajoId) => {
    try {
      const response = await fetch(`http://localhost:8080/calificaciones/trabajo/${trabajoId}`);
      if (!response.ok) {
        if (response.status === 404) {
          // No hay calificaciones
          setCalificacionInfo(null);
        } else {
          throw new Error('Failed to fetch calificación details');
        }
      } else {
        const calificacionData = await response.json();
        if (calificacionData.length > 0) {
          setCalificacionInfo(calificacionData[0]); // Tomar la primera calificación de la lista
        } else {
          setCalificacionInfo(null);
        }
      }
      setOpenCalificacion(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseCalificacion = () => {
    setOpenCalificacion(false);
    setCalificacionInfo(null);
  };

  const filteredHistorial = historial.filter(item =>
    filtro === 'todos'
      ? item.estado === 'EN_PROCESO' || item.estado === 'TERMINADO'
      : item.estado === filtro
  );

  const getCountByState = (state) => historial.filter(item => item.estado === state).length;

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <LogoBarFreelance />
      <h1 className={styles.title}>Historial</h1>
      <Tabs value={filtro} onChange={handleFiltroChange} className={styles.tabs}>
        <Tab label={`Todos (${getCountByState('EN_PROCESO') + getCountByState('TERMINADO')})`} value="todos" />
        <Tab label={`En Proceso (${getCountByState('EN_PROCESO')})`} value="EN_PROCESO" />
        <Tab label={`Terminado (${getCountByState('TERMINADO')})`} value="TERMINADO" />
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
                <p><strong>Fecha Límite:</strong> {new Date(historialItem.trabajo.fechaLimite).toLocaleDateString()}</p>
                <p><strong>Presupuesto:</strong> {historialItem.presupuesto}</p>
                <p><strong>Estado:</strong> {historialItem.estado}</p>
                {historialItem.estado === 'EN_PROCESO' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewContact(historialItem)}
                  >
                    Ver Contacto
                  </Button>
                )}
              </div>
              {historialItem.estado === 'TERMINADO' && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewCalificacion(historialItem.trabajo.idtrabajo)}
                >
                  Ver Calificación
                </Button>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contacto del Cliente</DialogTitle>
        <DialogContent>
          {clienteInfo && (
            <>
              <div className={styles.clienteImageWrapper}>
                <img
                  src={`data:image/jpeg;base64,${clienteInfo.imagen}`}
                  alt={clienteInfo.nombre}
                  className={styles.clienteImage}
                />
              </div>
              <DialogContentText>
                <strong>Nombre:</strong> {clienteInfo.nombre}<br />
                <strong>Email:</strong> {clienteInfo.correo}<br />
                <strong>Número:</strong> {clienteInfo.numero}
              </DialogContentText>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openCalificacion} onClose={handleCloseCalificacion}>
        <DialogTitle>Calificación del Trabajo</DialogTitle>
        <DialogContent>
          {calificacionInfo ? (
            <>
              <Typography variant="h6">Calificación:</Typography>
              <Rating name="read-only" value={calificacionInfo.calificacion} readOnly />
              <Typography variant="h6">Comentario:</Typography>
              <DialogContentText>{calificacionInfo.comentario}</DialogContentText>
            </>
          ) : (
            <Typography variant="body1">Todavía no fue calificado por el cliente.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCalificacion} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Historial;
