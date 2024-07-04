import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Alert, Button, Snackbar, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Pagination } from '@mui/material';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/verPropuestas.module.css';

const Propuestas = () => {
  const { user } = useContext(AppContext);
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [currentPropuestaId, setCurrentPropuestaId] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!user || !user.idfreelancer) {
      setError("Debes iniciar sesión para ver tus postulaciones.");
      return;
    }

    const fetchPropuestas = async () => {
      try {
        const response = await fetch(`http://localhost:8080/postulaciones/freelancer/${user.idfreelancer}`);
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
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/${propuestaId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete postulación');
      }
      setPropuestas(propuestas.filter(propuesta => propuesta.id !== propuestaId));
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewContact = async (propuesta) => {
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/cliente/${propuesta.trabajo.cliente.idcliente}/detalle`);
      if (!response.ok) {
        throw new Error('Failed to fetch client details');
      }
      const clienteData = await response.json();
      setClienteInfo(clienteData);
      setCurrentPropuestaId(propuesta.id);
      setOpen(true);

      // Update the state to "EN_PROCESO"
      const updateResponse = await fetch(`http://localhost:8080/postulaciones/${propuesta.id}/actualizar-estado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'EN_PROCESO' }),
      });
      if (!updateResponse.ok) {
        throw new Error('Failed to update proposal status');
      }

      // Update the local state
      setPropuestas(propuestas.map(p => p.id === propuesta.id ? { ...p, estado: 'EN_PROCESO' } : p));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setClienteInfo(null);
    setConfirmationOpen(true); // Show the confirmation message
  };

  const filteredPropuestas = propuestas.filter(propuesta => {
    if (filter === 'Todos') {
      return propuesta.estado !== 'EN_PROCESO' && propuesta.estado !== 'TERMINADO';
    }
    return propuesta.estado === filter;
  });

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setPage(1); // Reset page to 1 when filter changes
  };

  const getCountByState = (state) => propuestas.filter(propuesta => propuesta.estado === state).length;

  const paginatedPropuestas = filteredPropuestas.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <LogoBarFreelance />
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Postulaciones</h1>
        <Tabs
          value={filter}
          onChange={handleFilterChange}
          className={styles.tabs}
          centered
        >
          <Tab label={`Todos (${propuestas.filter(p => p.estado !== 'EN_PROCESO' && p.estado !== 'TERMINADO').length})`} value="Todos" />
          <Tab label={`Pendiente (${getCountByState('PENDIENTE')})`} value="PENDIENTE" />
          <Tab label={`Aceptado (${getCountByState('ACEPTADO')})`} value="ACEPTADO" />
          <Tab label={`Rechazado (${getCountByState('RECHAZADO')})`} value="RECHAZADO" />
        </Tabs>
        <Box className={styles.propuestasWrapper}>
          {error && <Alert severity="error">{error}</Alert>}
          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            message="Postulación eliminada correctamente"
          />
          <Snackbar
            open={confirmationOpen}
            autoHideDuration={6000}
            onClose={() => setConfirmationOpen(false)}
            message="Ahora el trabajo lo podrás ver en la sección de historial."
          />
          <Grid container spacing={2} justifyContent="center">
            {paginatedPropuestas.length > 0 ? (
              paginatedPropuestas.map((propuesta, index) => (
                <Grid item key={index} className={styles.propuestaItem}>
                  <div className={styles.propuestaDetails}>
                    {propuesta.trabajo.imagen ? (
                      <img
                        src={`data:image/jpeg;base64,${propuesta.trabajo.imagen}`}
                        alt={propuesta.trabajo.titulo}
                        className={styles.trabajoImage}
                      />
                    ) : (
                      <p>Imagen no disponible.</p>
                    )}
                    <Typography variant="h6" className={styles.trabajoTitle}>{propuesta.trabajo.titulo}</Typography>
                    <Typography variant="body1" className={styles.trabajoDescription}>{propuesta.trabajo.descripcion}</Typography>
                    <Typography variant="body2" className={styles.trabajoUbicacion}>Ubicación: {propuesta.trabajo.ubicacion}</Typography>
                    <Typography variant="body2" className={styles.trabajoPresupuesto}>Presupuesto: {propuesta.presupuesto}</Typography>
                    <Typography variant="body2" className={styles.trabajoDisponibilidad}>Disponibilidad: {propuesta.disponibilidad}</Typography>
                    <Typography variant="body2" className={styles.trabajoEstado}>Estado: {propuesta.estado}</Typography>
                    {propuesta.estado === 'ACEPTADO' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        className={styles.contactButton}
                        onClick={() => handleViewContact(propuesta)}
                      >
                        VER CONTACTO DEL CLIENTE
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color={propuesta.estado === 'RECHAZADO' ? "error" : "secondary"}
                        className={styles.cancelButton}
                        onClick={() => handleCancel(propuesta.id)}
                      >
                        ELIMINAR POSTULACIÓN
                      </Button>
                    )}
                  </div>
                </Grid>
              ))
            ) : (
              <Alert severity="info" className={styles.noPostulationsMessage}>
                No hay postulaciones con este estado.
              </Alert>
            )}
          </Grid>
          {filteredPropuestas.length > itemsPerPage && (
            <Pagination
              count={Math.ceil(filteredPropuestas.length / itemsPerPage)}
              page={page}
              onChange={(e, newPage) => setPage(newPage)}
              className={styles.pagination}
            />
          )}
        </Box>
      </div>
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
    </>
  );
};

export default Propuestas;
