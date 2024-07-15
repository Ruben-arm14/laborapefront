import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, Alert, Tabs, Tab, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Pagination } from '@mui/material';
import EditarTrabajoModal from '@/components/trabajos/EditarTrabajoModal';
import MisTrabajosCard from '@/components/trabajos/MisTrabajosCard';
import LogoBar from '@/components/layout/LogoBar';
import { AppContext } from '@/context/AppContext';
import Rating from '@mui/material/Rating';
import styles from '@/styles/global/misTrabajos.module.css';

const MisTrabajos = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  const [trabajoParaEditar, setTrabajoParaEditar] = useState(null);
  const [trabajoParaContacto, setTrabajoParaContacto] = useState(null);
  const [freelancerInfo, setFreelancerInfo] = useState(null);
  const [openFreelancerModal, setOpenFreelancerModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openFinalizeModal, setOpenFinalizeModal] = useState(false);
  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [openRateSnackbar, setOpenRateSnackbar] = useState(false);
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState(''); // Estado inicial vacío
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
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

        const response = await fetch(`http://localhost:8080/trabajos/cliente/${cliente.idcliente}`);
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        setTrabajos(data);

        // Ajustar el estado inicial según el primer estado disponible
        if (data.length > 0) {
          const uniqueEstados = [...new Set(data.map(trabajo => trabajo.estado))];
          setEstadoFiltro(uniqueEstados[0]);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) {
      fetchTrabajos();
    }
  }, [user]);

  const handleEdit = (trabajo) => {
    setTrabajoParaEditar(trabajo);
  };

  const actualizarEstadoTrabajo = async (idtrabajo, estado) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/actualizar-estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado })
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      setTrabajos(trabajos.map(trabajo =>
        trabajo.idtrabajo === idtrabajo ? { ...trabajo, estado } : trabajo
      ));
    } catch (err) {
      setError(err.message);
    }
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

  const finalizarTrabajoYPostulacion = async (idtrabajo) => {
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

  const handleContact = async (idtrabajo) => {
    console.log("handleContact llamado con idtrabajo:", idtrabajo);
    try {
      // Actualizar el estado del trabajo a "EN_PROCESO"
      await actualizarEstadoTrabajo(idtrabajo, 'EN_PROCESO');

      // Obtener la información del freelancer
      const response = await fetch(`http://localhost:8080/freelancers/trabajo/${idtrabajo}/detalle`);
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

  const handleCloseFreelancerModal = () => {
    setOpenFreelancerModal(false);
    setFreelancerInfo(null);
    setOpenSnackbar(true);
  };

  const handleFinalize = (trabajo) => {
    setTrabajoParaContacto(trabajo);
    setOpenFinalizeModal(true);
  };

  const handleConfirmFinalize = async () => {
    if (trabajoParaContacto) {
      try {
        await finalizarTrabajoYPostulacion(trabajoParaContacto.idtrabajo);
        setOpenFinalizeModal(false);
        setTrabajoParaContacto(null);
        setOpenSnackbar(true);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleRate = async (trabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajo.idtrabajo}/freelancer`);
      if (!response.ok) {
        throw new Error("Error al obtener freelancer");
      }
      const freelancerData = await response.json();
      setTrabajoParaContacto(trabajo);
      setFreelancerInfo(freelancerData);
      setOpenRateDialog(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitRate = async () => {
    try {
      const response = await fetch('http://localhost:8080/calificaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idtrabajo: trabajoParaContacto.idtrabajo,
          idusuario: user.idusuario,
          idfreelancer: freelancerInfo.idfreelancer,
          calificacion: rating,
          comentario: comment
        })
      });

      if (!response.ok) {
        throw new Error("Error al enviar la calificación");
      }

      await actualizarEstadoTrabajo(trabajoParaContacto.idtrabajo, 'CALIFICADO');

      setOpenRateDialog(false);
      setOpenRateSnackbar(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseRateDialog = () => {
    setOpenRateDialog(false);
  };

  const handleCloseRateSnackbar = () => {
    setOpenRateSnackbar(false);
  };

  const handleSave = (updatedTrabajo) => {
    setTrabajoParaEditar(null);
    setTrabajos(trabajos.map(trabajo =>
      trabajo.idtrabajo === updatedTrabajo.idtrabajo ? updatedTrabajo : trabajo
    ));
  };

  const handleEstadoChange = (event, newValue) => {
    setEstadoFiltro(newValue);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const filteredTrabajos = trabajos.filter(trabajo => trabajo.estado === estadoFiltro);
  const uniqueEstados = [...new Set(trabajos.map(trabajo => trabajo.estado))];
  const paginatedTrabajos = filteredTrabajos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <>
      <LogoBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Mis Trabajos</h1>
        {uniqueEstados.length === 0 ? (
          <Alert severity="info">Por el momento no tienes trabajos.</Alert>
        ) : (
          <>
            <Tabs
              value={estadoFiltro}
              onChange={handleEstadoChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              {uniqueEstados.map((estado, index) => (
                <Tab key={index} label={estado.replace('_', ' ')} value={estado} />
              ))}
            </Tabs>
            <Box className={styles.trabajosContainer}>
              {error && <Alert severity="error">{error}</Alert>}
              {filteredTrabajos.length === 0 && !error ? (
                <Alert severity="info" className={styles.noTrabajosMessage}>
                  Por el momento no tienes trabajos con ese estado.
                </Alert>
              ) : (
                <Grid container spacing={2} justifyContent="center">
                  {paginatedTrabajos.map((trabajo) => (
                    <Grid item key={trabajo.idtrabajo} className={styles.trabajoItem}>
                      <MisTrabajosCard
                        key={trabajo.idtrabajo}
                        trabajo={trabajo}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onContact={() => handleContact(trabajo.idtrabajo)}
                        onFinalize={() => handleFinalize(trabajo)}
                        onRate={() => handleRate(trabajo)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            <Pagination
              count={Math.ceil(filteredTrabajos.length / itemsPerPage)}
              page={page}
              onChange={(event, value) => setPage(value)}
              className={styles.pagination}
            />
          </>
        )}
        {trabajoParaEditar && (
          <EditarTrabajoModal
            trabajo={trabajoParaEditar}
            onClose={() => setTrabajoParaEditar(null)}
            onSave={handleSave}
          />
        )}
        {freelancerInfo && (
          <Dialog open={openFreelancerModal} onClose={handleCloseFreelancerModal}>
            <DialogTitle>Contacto del Freelancer</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseFreelancerModal} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {trabajoParaContacto && (
          <Dialog open={openFinalizeModal} onClose={() => setOpenFinalizeModal(false)}>
            <DialogTitle>Confirmar Finalización</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro que deseas finalizar el trabajo?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenFinalizeModal(false)} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleConfirmFinalize} color="primary">
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        )}
        {trabajoParaContacto && (
          <Dialog open={openRateDialog} onClose={handleCloseRateDialog}>
            <DialogTitle>Calificar Freelancer</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor, califica el trabajo realizado por el freelancer.
              </DialogContentText>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
              <TextField
                autoFocus
                margin="dense"
                id="comment"
                label="Comentario"
                type="text"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRateDialog} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleSubmitRate} color="primary">
                Enviar
              </Button>
            </DialogActions>
          </Dialog>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message="El trabajo ha sido actualizado."
          action={
            <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
              OK
            </Button>
          }
        />
        <Snackbar
          open={openRateSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseRateSnackbar}
          message="Calificación enviada."
          action={
            <Button color="inherit" size="small" onClick={handleCloseRateSnackbar}>
              OK
            </Button>
          }
        />
      </div>
    </>
  );
};

export default MisTrabajos;
