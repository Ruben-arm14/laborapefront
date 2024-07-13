import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import styles from '@/styles/global/perfilcliente.module.css';
import LogoBar from '@/components/layout/LogoBar';
import { AppContext } from "@/context/AppContext";

const PerfilCliente = () => {
  const { user } = useContext(AppContext);
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    email: "",
    numero: "",
    contrasena: "",
    imagen: null,
    imagenUrl: ""
  });
  const router = useRouter();

  useEffect(() => {
    const fetchPerfil = async (idUsuario) => {
      try {
        const response = await fetch(`http://localhost:8080/usuarios/perfil/${idUsuario}`);
        if (response.ok) {
          const data = await response.json();
          setPerfil(data);
          setFormPerfil({
            nombre: data.nombre,
            edad: data.edad,
            sexo: data.sexo,
            email: data.correo,
            numero: data.numero,
            contrasena: data.contrasena,
            imagen: null,
            imagenUrl: data.imagen ? `data:image/jpeg;base64,${data.imagen}` : "https://via.placeholder.com/150"
          });
        } else {
          throw new Error("Error al obtener el perfil");
        }
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    if (user) {
      fetchPerfil(user.idusuario);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormPerfil({
      ...formPerfil,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormPerfil({
          ...formPerfil,
          imagen: file,
          imagenUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarPerfil = async () => {
    setIsLoading(true);
    const idUsuario = user.idusuario;

    try {
      const formData = new FormData();
      formData.append("nombre", formPerfil.nombre);
      formData.append("edad", perfil.edad); // No permitir cambiar edad
      formData.append("sexo", perfil.sexo); // No permitir cambiar sexo
      formData.append("correo", formPerfil.email);
      formData.append("numero", formPerfil.numero);
      formData.append("contrasena", formPerfil.contrasena);
      formData.append("rol", perfil.rol); // No permitir cambiar rol
      if (formPerfil.imagen) {
        formData.append("imagen", formPerfil.imagen);
      }

      const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPerfil(data);
        toast.success("Perfil actualizado correctamente", {
          position: "top-right",
          autoClose: 5000,
          className: styles.toastSuccess,
          hideProgressBar: true,
        });
        setEditMode(false);
      } else {
        const errorData = await response.json();
        toast.error(`Error al guardar el perfil: ${errorData.error || "Error desconocido"}`, {
          position: "top-right",
          autoClose: 5000,
          className: styles.toastError,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error(`Error al guardar el perfil: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        className: styles.toastError,
        hideProgressBar: true,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegresar = () => {
    setEditMode(false);
  };

  return (
    <div className={styles.container}>
      <LogoBar />
      <ToastContainer />
      {perfil && (
        <div className={styles.perfilContainer}>
          <div className={styles.imageSection}>
            <img 
              src={formPerfil.imagenUrl || "/images/default-profile.png"} 
              alt="Imagen del perfil" 
              className={styles.perfilImage} 
            />
            <p>{perfil.nombre}</p>
          </div>
          {editMode ? (
            <form className={styles.formSection}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formPerfil.email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Contraseña"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                value={formPerfil.contrasena}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Número"
                name="numero"
                type="text"
                value={formPerfil.numero}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Edad"
                name="edad"
                type="number"
                value={formPerfil.edad}
                fullWidth
                required
                margin="normal"
                disabled // Deshabilitar el cambio de edad
              />
              <TextField
                label="Sexo"
                name="sexo"
                value={formPerfil.sexo}
                fullWidth
                required
                margin="normal"
                disabled // Deshabilitar el cambio de sexo
              />
              <div className={styles.buttonGroup}>
                <label htmlFor="raised-button-file">
                  <Button variant="contained" component="span" className={styles.uploadButton}>
                    Subir Imagen
                  </Button>
                </label>
                <input
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="raised-button-file"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGuardarPerfil}
                  disabled={isLoading}
                  className={styles.saveButton}
                >
                  {isLoading ? 'Guardando...' : 'Guardar Perfil'}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRegresar}
                  className={styles.regresarButton}
                >
                  Regresar
                </Button>
              </div>
            </form>
          ) : (
            <div className={styles.formSection}>
              <div className={styles.perfilDetails}>
                <p>Email: {perfil.correo}</p>
                <p>Contraseña: ********</p>
                <p>Número: {perfil.numero}</p>
                <p>Edad: {perfil.edad}</p>
                <p>Sexo: {perfil.sexo}</p>
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  className={styles.editButton}
                >
                  Editar Perfil
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilCliente;
