import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import styles from './Filtros.module.css';

function BasicButtons({ texto, style, funcion }) {
    return (
        <Stack spacing={2} direction="row">
            <Button
                className={`${styles.estilo} ${styles.boton}`} // Agrega la clase estilo y cualquier otra clase necesaria
                style={style}
                variant="contained"
                sx={{
                    '&:hover': {
                        backgroundColor: "#caaafc"
                    }
                }}
            >
                {texto}
            </Button>
        </Stack>
    );
}

export default BasicButtons;