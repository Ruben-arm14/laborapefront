import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Alert, Pagination, Typography } from '@mui/material';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { AppContext } from '@/context/AppContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '@/styles/global/trabajosFreelancer.module.css';
import PostularPopup from '@/components/trabajos/PostularPopup';

const TrabajosFreelancer = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTrabajos = async () => {
      try {
        const response = await fetch('http://localhost:8080/trabajos/estado/PUBLICADO');
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        return data;
      } catch (err) {
        setError(err.message);
        return [];
      }
    };

    const fetchPostulaciones = async () => {
      try {
        const response = await fetch(`http://localhost:8080/postulaciones/freelancer/${user.idfreelancer}`);
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        return data.map(postulacion => postulacion.trabajo.idtrabajo);
      } catch (err) {
        setError(err.message);
        return [];
      }
    };

    const fetchData = async () => {
      const trabajosData = await fetchTrabajos();
      const postulacionesData = await fetchPostulaciones();
      console.log("Trabajos obtenidos:", trabajosData);
      console.log("Postulaciones obtenidas:", postulacionesData);
      const trabajosFiltrados = trabajosData.filter(trabajo => !postulacionesData.includes(trabajo.idtrabajo));
      setTrabajos(trabajosFiltrados);
      const categoriasUnicas = [...new Set(trabajosFiltrados.map(trabajo => trabajo.categoria))];
      setCategorias(categoriasUnicas);
    };

    if (user && user.idfreelancer) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.idusuario) return;

    const fetchFreelancerProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8080/usuarios/perfilfreelancer/${user.idusuario}`);
        if (!response.ok) {
          throw new Error("Error al obtener el perfil del freelancer");
        }
        const data = await response.json();
        console.log("Perfil del freelancer:", data);
        setUser(prevUser => ({
          ...prevUser,
          habilidades: data.habilidades,
          idfreelancer: data.idfreelancer
        }));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFreelancerProfile();
  }, [user && user.idusuario, setUser]);

  const handleOpen = (trabajo) => {
    if (!user.habilidades || user.habilidades.trim() === "") {
      alert("Antes de postular debes llenar tus HABILIDADES en la sección de perfil");
      return;
    }
    console.log("Abriendo postulación para el trabajo:", trabajo);
    setSelectedTrabajo(trabajo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTrabajo(null);
  };

  const handlePostular = async () => {
    console.log("Postulando al trabajo:", selectedTrabajo);
    console.log("Datos del freelancer:", user);
    const updatedTrabajos = trabajos.filter(trabajo => trabajo.idtrabajo !== selectedTrabajo.idtrabajo);
    setTrabajos(updatedTrabajos);
    handleClose();
    toast.success("Tu postulación fue enviada correctamente!");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const indexOfLastPost = page * rowsPerPage;
  const indexOfFirstPost = indexOfLastPost - rowsPerPage;
  const currentTrabajos = trabajos.filter(trabajo => !categoriaSeleccionada || trabajo.categoria === categoriaSeleccionada).slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <LogoBarFreelance />
      <div className={styles.containerTrabajosFreelancer}>
        <h1 className={styles.titleFreelancer}>Trabajos Disponibles</h1>
        <div className={styles.filtroContainer}>
          {categorias.map((categoria, index) => (
            <button
              key={index}
              className={`${styles.filtroButton} ${categoriaSeleccionada === categoria ? styles.active : ''}`}
              onClick={() => handleCategoriaChange(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
        <Box className={styles.trabajosContainerFreelancer}>
          {error && <Alert severity="error">{error}</Alert>}
          <Grid container spacing={4} justifyContent="center">
            {currentTrabajos.length > 0 ? (
              currentTrabajos.map((trabajo, index) => (
                <Grid item key={index} className={styles.trabajoItemFreelancer}>
                  <div className={styles.trabajoDetailsFreelancer}>
                    <img src={`http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`} alt={trabajo.titulo} className={styles.trabajoImageFreelancer} />
                    <Typography variant="h6" className={styles.trabajoTitulo}>{trabajo.titulo}</Typography>
                    <Typography variant="body1" className={styles.trabajoDescripcionFreelancer}>{trabajo.descripcion}</Typography>
                    <Typography variant="body2" className={styles.trabajoPresupuestoFreelancer}>Presupuesto: {trabajo.presupuesto}</Typography>
                    <Typography variant="body2" className={styles.trabajoClienteFreelancer}>Cliente: {trabajo.nombreCliente || 'Desconocido'}</Typography>
                    <Typography variant="body2" className={styles.trabajoUbicacionFreelancer}>Ubicación: {trabajo.ubicacion}</Typography>
                    <Typography variant="body2" className={styles.trabajoCategoriaFreelancer}>Categoria: {trabajo.categoria}</Typography>
                    <Typography variant="body2" className={styles.trabajoFechaLimiteFreelancer}>Fecha Límite: {new Date(trabajo.fechaLimite).toLocaleString()}</Typography>
                    <button className={styles.postularButtonFreelancer} onClick={() => handleOpen(trabajo)}>POSTULAR</button>
                  </div>
                </Grid>
              ))
            ) : (
              <Alert severity="info" className={styles.noTrabajosMessage}>
                Por el momento no hay trabajos disponibles.
              </Alert>
            )}
          </Grid>
        </Box>
        <Pagination
          count={Math.ceil(trabajos.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          className={styles.pagination}
        />
      </div>
      <ToastContainer />
      {user && selectedTrabajo && (
        <PostularPopup
          open={open}
          onClose={handleClose}
          trabajo={selectedTrabajo}
          freelancer={user}
          onPostular={handlePostular}
        />
      )}
    </>
  );
};

export default TrabajosFreelancer;
