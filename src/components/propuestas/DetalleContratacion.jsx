import { Button, Box, Typography, Modal, IconButton, TextareaAutosize } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetalleContratacion = (props) => {
    const { open, onClose, propuesta } = props;

    return (
        <Modal
            open={open}
            onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                    onClose();
                }
            }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                top: '50%',
                left: '50%',
                width: '80%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                position: 'absolute'
            }}>
                <IconButton sx={{ position: 'absolute', top: 16, right: 16 }} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <img src={propuesta.imagenUrl} alt="propuestaImage" 
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 8 }} 
                    />
                    <Typography variant="h5">{propuesta.titulo}</Typography>
                    <Typography variant="body1">{propuesta.descripcion}</Typography>
                    <Typography variant="body2">Lugar: {propuesta.ubicacion}</Typography>
                    <Typography variant="body2">Fecha límite: {new Date(propuesta.fechaLimite).toLocaleDateString()}</Typography>
                    <TextareaAutosize
                        minRows={5}
                        placeholder="Escribe tu propuesta aquí..."
                        style={{ width: '100%', marginTop: '16px', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                        <Button variant="contained" sx={{ mt: 4 }}>ACEPTAR PROPUESTA</Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default DetalleContratacion;
