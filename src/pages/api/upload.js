import nextConnect from 'next-connect';
import multer from 'multer';

// Configuración de multer para guardar las imágenes
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // Ruta donde se guardarán las imágenes
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

// Middleware para manejar la carga de archivos
const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Something went wrong: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

apiRoute.use(upload.single('imagen'));

apiRoute.post((req, res) => {
  const { idcliente, titulo, descripcion, categoria, ubicacion, fechaLimite, estado, presupuesto } = req.body;
  const imagen = req.file;

  // Lógica para guardar la información en la base de datos

  res.status(200).json({ message: 'Actividad guardada correctamente' });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Desactivar el análisis del cuerpo de la solicitud
  },
};
