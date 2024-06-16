import { Button, Typography, Card, CardActions, CardContent, CardMedia } from '@mui/material';

const PropuestaCard = ({ id, nombre, descripcion, image, detalle }) => {

    return (
        <Card key={id} sx={{ maxWidth: 345, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia
                sx={{ height: 200 }}
                image={image}
                title="propuestaImage"
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {descripcion.length > 200 ? `${descripcion.slice(0, 200)}...` : descripcion}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={detalle}>Más detalles</Button>
            </CardActions>
        </Card>
    )
}

export default PropuestaCard;