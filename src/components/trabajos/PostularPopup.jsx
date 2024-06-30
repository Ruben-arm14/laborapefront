import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';

const PostularPopup = ({ open, onClose, trabajo, freelancerId }) => {
    const [mensaje, setMensaje] = useState('');
    const [presupuesto, setPresupuesto] = useState('');
    const [nombreCliente, setNombreCliente] = useState('');
    const [tituloTrabajo, setTituloTrabajo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagenUrl, setImagenUrl] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [fechaLimite, setFechaLimite] = useState('');

    React.useEffect(() => {
        if (trabajo) {
            setNombreCliente(trabajo.nombreCliente || '');
            setTituloTrabajo(trabajo.titulo || '');
            setDescripcion(trabajo.descripcion || '');
            setImagenUrl(trabajo.imagenUrl || '');
            setUbicacion(trabajo.ubicacion || '');
            setFechaLimite(trabajo.fechaLimite || '');
        }
    }, [trabajo]);

    const handlePostular = async () => {
        if (!trabajo || !trabajo.idtrabajo || !trabajo.idcliente) {
            alert("El trabajo o el cliente no está definido.");
            return;
        }

        const postulacion = {
            trabajoId: trabajo.idtrabajo,
            clienteId: trabajo.idcliente,
            freelancerId: freelancerId,
            mensaje: mensaje,
            presupuesto: presupuesto
        };

        try {
            const response = await fetch('http://localhost:8080/postulaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postulacion),
            });

            if (response.ok) {
                alert("Solicitud enviada");
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Postular a {tituloTrabajo}</DialogTitle>
            <DialogContent>
                {imagenUrl && (
                    <Box mb={2} display="flex" justifyContent="center">
                        <img src={imagenUrl} alt={tituloTrabajo} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                    </Box>
                )}
                <Typography variant="h6">{tituloTrabajo}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>{nombreCliente}</Typography>
                <Typography variant="body1" gutterBottom>{descripcion}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>Ubicación: {ubicacion}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>Fecha Límite: {fechaLimite}</Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Mensaje"
                    type="text"
                    fullWidth
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Presupuesto"
                    type="number"
                    fullWidth
                    value={presupuesto}
                    onChange={(e) => setPresupuesto(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handlePostular}>Postular</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PostularPopup;
