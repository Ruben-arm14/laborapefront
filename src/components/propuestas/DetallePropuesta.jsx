import { Button, Box, Typography, Modal, IconButton, TextareaAutosize } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const DetallePropuesta = (props) => {
    const {open, handleClose, propuesta, enviar} = props;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                top: '50%',
                left: '50%',
                width: '100%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
                position: 'absolute'
            }}
                maxWidth='md'>
                <IconButton sx={{ position: 'absolute', top: 16, right: 16 }} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }}>
                        <img src={`/imagenes/${propuesta.imagen}`} alt="propuestaImage" 
                            style={{ width: '300px', height: '200px', objectFit: 'cover', borderRadius: 8 }} 
                        />
                    </Box>
                    <Box sx={{ flex: '2 1 auto' }}>
                        <Typography variant="h6">Lugar donde se realiza (LOCATION)</Typography>
                        <Typography variant="body2" color="text.secondary">Fecha y hora de publicación</Typography>
                        <Typography variant="body2" color="text.secondary">INFORMACIÓN EXTRA</Typography>
                    </Box>
                </Box>
                <Typography variant="h5" sx={{ mt: 2 }}>{propuesta.nombre}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>{propuesta.descripcion}</Typography>
                <TextareaAutosize
                    minRows={5}
                    placeholder="Escribe tu propuesta aquí..."
                    style={{ width: '100%', marginTop: '16px', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
                    <Button variant="contained" sx={{ mt: 4 }} onClick={enviar()}>ENVIAR PROPUESTA</Button>
                </Box>
            </Box>
      </Modal>
    )
}

export default DetallePropuesta;