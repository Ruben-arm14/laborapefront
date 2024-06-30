import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Alert, Pagination, Typography } from '@mui/material';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/trabajosFreelancer.module.css';
import PostularPopup from '@/components/trabajos/PostularPopup';

const TrabajosFreelancer = () => {
  const { user } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(4);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await fetch('http://localhost:8080/trabajos');
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        setTrabajos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTrabajos();
  }, []);

  const handleOpen = (trabajo) => {
    console.log('Abriendo popup para trabajo:', trabajo); // Verifica los datos del trabajo aquí
    setSelectedTrabajo(trabajo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrabajo(null);
    setMensaje('');
  };

  const handlePostulacion = async () => {
    if (user && user.idusuario && selectedTrabajo && mensaje) {
      try {
        const postulacionData = {
          freelancerId: user.idusuario,
          trabajoId: selectedTrabajo.idtrabajo,
          clienteId: selectedTrabajo.cliente.idcliente,
          mensaje: mensaje,
          presupuesto: selectedTrabajo.presupuesto
        };

        const response = await fetch('http://localhost:8080/postulaciones', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postulacionData),
        });

        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }

        setSuccess(true);
        handleClose();
      } catch (err) {
        setError(err.message);
      }
    } else {
      setError("Datos incompletos para realizar la postulación.");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const indexOfLastPost = page * rowsPerPage;
  const indexOfFirstPost = indexOfLastPost - rowsPerPage;
  const currentTrabajos = trabajos.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <LogoBarFreelance />
      <div className={styles.containerTrabajosFreelancer}>
        <h1 className={styles.titleFreelancer}>Trabajos Disponibles</h1>
        <Box className={styles.trabajosContainerFreelancer}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">¡Su postulación ha sido enviada!</Alert>}
          <Grid container spacing={2} justifyContent="center">
            {currentTrabajos.map((trabajo, index) => (
              <Grid item key={index} className={styles.trabajoItemFreelancer}>
                <div className={styles.trabajoDetailsFreelancer}>
                  <img src={`http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`} alt={trabajo.titulo} className={styles.trabajoImageFreelancer} />
                  <Typography variant="h6" className={styles.trabajoTitulo}>{trabajo.titulo}</Typography>
                  <Typography variant="body1" className={styles.trabajoDescripcion}>{trabajo.descripcion}</Typography>
                  <Typography variant="body2" className={styles.trabajoPresupuesto}>Presupuesto: {trabajo.presupuesto}</Typography>
                  <button className={styles.postularButtonFreelancer} onClick={() => handleOpen(trabajo)}>POSTULAR</button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Pagination
          count={Math.ceil(trabajos.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          className={styles.pagination}
        />
      </div>
      {user && selectedTrabajo && (
        <PostularPopup
          open={open}
          onClose={handleClose}
          trabajo={selectedTrabajo}
          freelancerId={user.idusuario}
        />
      )}
    </>
  );
};

export default TrabajosFreelancer;
