import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Alert, MenuItem, Select, FormControl, InputLabel, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar } from '@mui/material';
import MisTrabajosCard from '@/components/trabajos/MisTrabajosCard';
import LogoBar from '@/components/layout/LogoBar';
import { AppContext } from '@/context/AppContext';
import EditarTrabajoModal from '@/components/trabajos/EditarTrabajoModal';
import styles from '@/styles/global/misTrabajos.module.css';

const MisTrabajos = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [openFreelancerModal, setOpenFreelancerModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState('EN_REVISION'); // Estado por defecto
  const itemsPerPage = 4;

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    const fetchTrabajos = async () => {
      if (!user) {
        setError("Debes iniciar sesión para ver tus trabajos.");
        return;
      }

      try {
        const responseCliente = await fetch(`http://localhost:8080/clientes/usuario/${user.idusuario}`);
        if (!responseCliente.ok) {
          throw new Error("Error al obtener cliente");
        }
        const cliente = await responseCliente.json();

        const response = await fetch(`http://localhost:8080/trabajos/estado/${estadoFiltro}?clienteId=${cliente.idcliente}`);
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        setTrabajos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) {
      fetchTrabajos();
    }
  }, [user, estadoFiltro]);

  const handleEdit = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
  };

  const handleDelete = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      setTrabajos(trabajos.filter(trabajo => trabajo.idtrabajo !== idtrabajo));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContact = async (idusuario) => {
    console.log("handleContact llamado con usuario ID:", idusuario);
    try {
      const response = await fetch(`http://localhost:8080/freelancers/${idusuario}/detalle`);
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      const freelancerData = await response.json();
      console.log("Datos del freelancer:", freelancerData);
      setFreelancerInfo(freelancerData);
      setOpenFreelancerModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizarEstadoTrabajo = async (idtrabajo, estado) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/actualizar-estado`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      // Actualizamos el estado del trabajo localmente
      setTrabajos(trabajos.map(trabajo =>
        trabajo.idtrabajo === idtrabajo ? { ...trabajo, estado } : trabajo
      ));
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleCloseFreelancerModal = async () => {
    setOpenFreelancerModal(false);
    setFreelancerInfo(null);
    setOpenSnackbar(true);

    // Llama a actualizarEstadoTrabajo para cambiar el estado del trabajo a "EN_PROCESO"
    if (trabajoSeleccionado) {
      await actualizarEstadoTrabajo(trabajoSeleccionado.idtrabajo, 'EN_PROCESO');
    }
  };

  const handleAccept = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/aceptar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      setTrabajos(trabajos.map(trabajo => 
        trabajo.idtrabajo === idtrabajo ? { ...trabajo, estado: 'ACEPTADO' } : trabajo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalize = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/finalizar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      setTrabajos(trabajos.map(trabajo => 
        trabajo.idtrabajo === idtrabajo ? { ...trabajo, estado: 'FINALIZADO' } : trabajo
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRate = (idtrabajo) => {
    // lógica para calificar el trabajo
  };

  const closeModal = () => {
    setTrabajoSeleccionado(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleEstadoChange = (event) => {
    setEstadoFiltro(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const paginatedTrabajos = trabajos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <LogoBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Trabajos</h1>
        <div className={styles.filterContainer}>
          <FormControl variant="outlined" className={styles.formControl}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              value={estadoFiltro}
              onChange={handleEstadoChange}
              label="Estado"
            >
              <MenuItem value="EN_REVISION">En Revisión</MenuItem>
              <MenuItem value="RECHAZADO">Rechazado</MenuItem>
              <MenuItem value="PUBLICADO">Publicado</MenuItem>
              <MenuItem value="ACEPTADO">Aceptado</MenuItem>
              <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
              <MenuItem value="FINALIZADO">Finalizado</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Box className={styles.trabajosContainer}>
          {error && <Alert severity="error">{error}</Alert>}
          {trabajos.length === 0 && !error && (
            <Alert severity="info" className={styles.noTrabajosMessage}>
              Por el momento no tienes trabajos con ese estado.
            </Alert>
          )}
          <Grid container spacing={2} justifyContent="center">
            {paginatedTrabajos.map((trabajo) => (
              <Grid item key={trabajo.idtrabajo} className={styles.trabajoItem}>
                <MisTrabajosCard
                  key={trabajo.idtrabajo}
                  trabajo={trabajo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onContact={handleContact}
                  onAccept={handleAccept}
                  onFinalize={handleFinalize}
                  onRate={handleRate}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Pagination
          count={Math.ceil(trabajos.length / itemsPerPage)}
          page={page}
          onChange={handlePageChange}
          className={styles.pagination}
        />
        {trabajoSeleccionado && (
          <EditarTrabajoModal
            trabajo={trabajoSeleccionado}
            onClose={closeModal}
          />
        )}
        <Dialog open={openFreelancerModal} onClose={handleCloseFreelancerModal}>
          <DialogTitle>Contacto del Freelancer</DialogTitle>
          <DialogContent>
            {freelancerInfo ? (
              <>
                <div className={styles.freelancerImageWrapper}>
                  <img
                    src={`data:image/jpeg;base64,${freelancerInfo.imagen}`}
                    alt={freelancerInfo.nombre}
                    className={styles.freelancerImage}
                  />
                </div>
                <DialogContentText>
                  <strong>Nombre:</strong> {freelancerInfo.nombre}<br />
                  <strong>Email:</strong> {freelancerInfo.correo}<br />
                  <strong>Número:</strong> {freelancerInfo.numero}<br />
                </DialogContentText>
              </>
            ) : (
              <DialogContentText>Cargando información del freelancer...</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFreelancerModal} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="Su trabajo pasó a 'En Proceso', puede finalizarlo manualmente"
          action={
            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
              OK
            </Button>
          }
        />
      </div>
    </>
  );
};

export default MisTrabajos;
