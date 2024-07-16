import React, { useEffect, useState, useContext } from 'react';
import { Box, Grid, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoBarAdmin from '@/components/layout/LogoBarAdmin';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/vertrabajos.module.css';

const TrabajosAdmin = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      console.log("Usuario almacenado:", parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    console.log("Usuario actual:", user);
    if (user && user.rol === 'ADMIN') {
      fetchTrabajosEnRevision();
    } else {
      setError("No tienes permisos para acceder a esta sección.");
    }
  }, [user]);

  const fetchTrabajosEnRevision = async () => {
    try {
      const response = await fetch('http://localhost:8080/trabajos/estado/EN_REVISION');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener trabajos en revisión');
      }
      const data = await response.json();
      setTrabajos(data);
      const categoriasUnicas = [...new Set(data.map(trabajo => trabajo.categoria))];
      setCategorias(categoriasUnicas);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApprove = async (trabajoId) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajoId}/aprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al aprobar trabajo');
      }
      const result = await response.json();
      toast.success(result.message);
      fetchTrabajosEnRevision();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDisapprove = async (trabajoId) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajoId}/desaprobar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al desaprobar trabajo');
      }
      const result = await response.json();
      toast.error(result.message);
      fetchTrabajosEnRevision();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  return (
    <>
      <LogoBarAdmin />
      <div className={styles.container}>
        <h1 className={styles.title}>Revisión de trabajos</h1>
        {error && <p className={styles.error}>{error}</p>}
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
        <Box className={styles.trabajosWrapper}>
          <Grid container spacing={2} justifyContent="center">
            {trabajos.filter(trabajo => !categoriaSeleccionada || trabajo.categoria === categoriaSeleccionada).map((trabajo, index) => (
              <Grid item key={index} className={styles.trabajoItem}>
                <div className={styles.trabajoDetails}>
                  <img src={trabajo.imagenUrl || "https://via.placeholder.com/150"} alt={trabajo.titulo} className={styles.trabajoImage} />
                  <h2 className={styles.trabajoTitle}>{trabajo.titulo}</h2>
                  <p className={styles.trabajoDescription}>{trabajo.descripcion}</p>
                  <p className={styles.trabajoInfo}>Ubicación: {trabajo.ubicacion}</p>
                  <p className={styles.trabajoInfo}>Presupuesto: {trabajo.presupuesto}</p>
                  <p className={styles.trabajoInfo}>Categoría: {trabajo.categoria}</p>
                  <p className={styles.trabajoInfo}>Fecha Límite: {new Date(trabajo.fechaLimite).toLocaleDateString()}</p>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.approveButton}
                    onClick={() => handleApprove(trabajo.idtrabajo)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={styles.disapproveButton}
                    onClick={() => handleDisapprove(trabajo.idtrabajo)}
                  >
                    Desaprobar
                  </Button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
      <ToastContainer />
    </>
  );
};

export default TrabajosAdmin;
