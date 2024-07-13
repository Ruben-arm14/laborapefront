import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LogoBar from "@/components/layout/LogoBar";
import { AppContext } from "@/context/AppContext";
import styles from '@/styles/global/Formulario.module.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Formulario = () => {
  const router = useRouter();
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "Selecciona",
    imagen: null,
    fechafin: "",
    ubicacion: "",
    presupuesto: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevState) => ({ ...prevState, imagen: file }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prevState) => ({ ...prevState, fechafin: date }));
  };

  const validateForm = () => {
    if (!formData.titulo || formData.titulo.length > 25) {
      setError("El nombre de la tarea debe ser menor o igual a 25 caracteres y no puede estar vacío.");
      return false;
    }
    if (!formData.descripcion || formData.descripcion.length > 150) {
      setError("La descripción de la tarea debe ser menor o igual a 150 caracteres y no puede estar vacía.");
      return false;
    }
    if (!formData.ubicacion || formData.ubicacion.length > 50) {
      setError("La dirección debe ser menor o igual a 50 caracteres y no puede estar vacía.");
      return false;
    }
    if (!formData.presupuesto || isNaN(formData.presupuesto) || parseFloat(formData.presupuesto) < 0) {
      setError("El presupuesto debe ser un número positivo.");
      return false;
    }
    if (!formData.imagen) {
      setError("Debes subir una imagen.");
      return false;
    }
    if (formData.categoria === "Selecciona") {
      setError("Debes seleccionar una categoría.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) {
      setError("Debes iniciar sesión para publicar una actividad.");
      setIsLoading(false);
      return;
    }

    if (user.rol !== 'CLIENTE') {
      setError("Solo los usuarios con rol CLIENTE pueden publicar actividades.");
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const idcliente = user.idusuario;

    const fechaFinISO = formData.fechafin
      ? new Date(formData.fechafin).toISOString().replace(':', '%3A')
      : null;

    const trabajoData = new FormData();
    trabajoData.append("trabajoData", JSON.stringify({
      idcliente: idcliente,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      ubicacion: formData.ubicacion,
      fechaLimite: fechaFinISO,
      estado: "EN_REVISION",
      presupuesto: parseFloat(formData.presupuesto)
    }));

    if (formData.imagen) {
      trabajoData.append("imagen", formData.imagen);
    }

    try {
      const response = await fetch("http://localhost:8080/trabajos", {
        method: "POST",
        body: trabajoData
      });

      setIsLoading(false);

      if (response.ok) {
        setSuccess(true);
        setFormData({
          titulo: "",
          descripcion: "",
          categoria: "Selecciona",
          imagen: null,
          fechafin: "",
          ubicacion: "",
          presupuesto: "",
        });
        setTimeout(() => {
          router.push("/MisTrabajos");
        }, 2000); // Redirigir después de 2 segundos
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al enviar la actividad");
      }
    } catch (error) {
      setError("Error en la conexión. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 2);

  return (
    <div className={styles.bodyNoMargin}>
      <LogoBar />
      <div className={styles.formContainer}>
        <h1>Envía tu actividad</h1>
        <p>Por este formulario podrás subir el trabajo que desees ofrecer</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="titulo">Nombre de tarea:</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="descripcion">Descripción de la tarea:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={3}
              placeholder="Escribe la descripción de la actividad"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="ubicacion">Dirección completa:</label>
            <input type="text" id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="presupuesto">Presupuesto Promedio:</label>
            <input type="text" id="presupuesto" name="presupuesto" value={formData.presupuesto} onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="imagen">Subir imagen:</label>
            <input type="file" id="imagen" name="imagen" accept="image/*" onChange={handleImageChange} />
            <label htmlFor="imagen" className={`${styles.fileLabel} ${formData.imagen ? styles.fileLabelUploaded : ''}`}>
              {formData.imagen ? 'Archivo seleccionado' : 'Seleccionar archivo'}
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoria">Categoría:</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleInputChange}>
              <option value="Selecciona">--Selecciona--</option>
              <option value="Carpinteria">Carpintería</option>
              <option value="Electricista">Electricista</option>
              <option value="Mecanico">Mecánico</option>
              <option value="Plomero">Plomero</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fechafin">Disponibilidad de la tarea:</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={minDate}
              maxDate={maxDate}
              className={styles.dateInput}
              placeholderText="Selecciona fecha y hora"
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </form>
      </div>
      <Dialog
        open={success}
        onClose={() => setSuccess(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Actividad Enviada</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            La actividad se ha enviado correctamente y está en revisión. Serás redirigido a la página de Mis Trabajos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccess(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={!!error}
        onClose={() => setError(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Error</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {error}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setError(null)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Formulario;
