import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import styles from '@/styles/global/postularPopup.module.css';

const PostularPopup = ({ open, onClose, trabajo, freelancer, onPostular }) => {
  const [mensaje, setMensaje] = useState('');
  const [presupuesto, setPresupuesto] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');

  useEffect(() => {
    if (trabajo) {
      setMensaje('');
      setPresupuesto('');
      setDisponibilidad('');
    }
  }, [trabajo]);

  const handlePostular = async () => {
    if (!trabajo || !trabajo.idtrabajo || !trabajo.idcliente || !freelancer || !freelancer.idfreelancer) {
      toast.error("El trabajo, el cliente o el freelancer no están definidos.");
      return;
    }

    const postulacion = {
      trabajo: { idtrabajo: trabajo.idtrabajo },
      cliente: { idcliente: trabajo.idcliente },
      freelancer: { idfreelancer: freelancer.idfreelancer },
      mensaje: mensaje,
      presupuesto: parseFloat(presupuesto),
      disponibilidad: disponibilidad
    };

    try {
      const postulacionJSON = JSON.stringify(postulacion);
      const response = await fetch('http://localhost:8080/postulaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: postulacionJSON,
      });

      if (response.ok) {
        toast.success("Solicitud enviada");
        onPostular(); // Call the function to refresh the list of jobs
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: styles.dialogPaper }}>
      <DialogTitle className={styles.dialogTitle}>Postular a {trabajo?.titulo}</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <Box mb={2} display="flex" justifyContent="center">
          <img src={`http://localhost:8080/trabajos/${trabajo?.idtrabajo}/imagen`} alt={trabajo?.titulo} className={styles.trabajoImage} />
        </Box>
        <Typography variant="h6" className={styles.trabajoTitulo}>{trabajo?.titulo}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>{trabajo?.nombreCliente || 'Desconocido'}</Typography>
        <Typography variant="body1" gutterBottom className={styles.trabajoDescripcion}>{trabajo?.descripcion}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom className={styles.trabajoUbicacion}>Ubicación: {trabajo?.ubicacion}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom className={styles.trabajoFechaLimite}>Fecha Límite: {trabajo?.fechaLimite}</Typography>
        <FormControl fullWidth margin="dense">
          <InputLabel>Disponibilidad</InputLabel>
          <Select
            value={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.value)}
          >
            <MenuItem value="mañana">Mañana</MenuItem>
            <MenuItem value="tarde">Tarde</MenuItem>
            <MenuItem value="noche">Noche</MenuItem>
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="dense"
          label="Mensaje"
          type="text"
          fullWidth
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className={styles.mensajeInput}
        />
        <TextField
          margin="dense"
          label="Presupuesto"
          type="number"
          fullWidth
          value={presupuesto}
          onChange={(e) => setPresupuesto(e.target.value)}
          className={styles.presupuestoInput}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} className={styles.cancelButton}>Cancelar</Button>
        <Button onClick={handlePostular} className={styles.postularButton}>Postular</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PostularPopup;
