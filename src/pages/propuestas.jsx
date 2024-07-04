import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Alert, Button, Snackbar, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/verPropuestas.module.css';

const Propuestas = () => {
  const { user } = useContext(AppContext);
  const [propuestas, setPropuestas] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [clienteInfo, setClienteInfo] = useState(null);

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
    console.log(`Eliminando postulación con ID: ${propuestaId}`);
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

  const handleViewContact = async (clienteId) => {
    if (!clienteId) {
      setError("ID de cliente no encontrado.");
      return;
    }
    console.log("Cliente ID:", clienteId);
    try {
      const response = await fetch(`http://localhost:8080/postulaciones/cliente/${clienteId}/detalle`);
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      const data = await response.json();
      setClienteInfo(data);
      setOpen(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setClienteInfo(null);
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
                        onClick={() => handleViewContact(propuesta.trabajo.cliente.idusuario)}
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
              <Typography>No hay postulaciones enviadas.</Typography>
            )}
          </Grid>
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
