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
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(4);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await fetch('http://localhost:8080/trabajos/estado/APROBADO'); // Solo trabajos aprobados
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
    setSelectedTrabajo(trabajo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrabajo(null);
  };

  const handlePostular = async () => {
    // Filtrar los trabajos para eliminar el trabajo seleccionado después de postular
    const updatedTrabajos = trabajos.filter(trabajo => trabajo.idtrabajo !== selectedTrabajo.idtrabajo);
    setTrabajos(updatedTrabajos);
    handleClose();
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
          <Grid container spacing={4} justifyContent="center">
            {currentTrabajos.map((trabajo, index) => (
              <Grid item key={index} className={styles.trabajoItemFreelancer}>
                <div className={styles.trabajoDetailsFreelancer}>
                  <img src={`http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`} alt={trabajo.titulo} className={styles.trabajoImageFreelancer} />
                  <Typography variant="h6" className={styles.trabajoTitulo}>{trabajo.titulo}</Typography>
                  <Typography variant="body1" className={styles.trabajoDescripcionFreelancer}>{trabajo.descripcion}</Typography>
                  <Typography variant="body2" className={styles.trabajoPresupuestoFreelancer}>Presupuesto: {trabajo.presupuesto}</Typography>
                  <Typography variant="body2" className={styles.trabajoClienteFreelancer}>Cliente: {trabajo.nombreCliente || 'Desconocido'}</Typography>
                  <Typography variant="body2" className={styles.trabajoUbicacionFreelancer}>Ubicación: {trabajo.ubicacion}</Typography>
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
          freelancer={user} // Pasamos el objeto completo del usuario
          onPostular={handlePostular}
        />
      )}
    </>
  );
};

export default TrabajosFreelancer;
