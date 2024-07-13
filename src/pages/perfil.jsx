import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/perfil.module.css';
import LogoBarFreelance from '@/components/layout/LogoBarFreelance';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Perfil = () => {
  const { user, setUser } = useContext(AppContext);
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    email: "",
    contrasena: "",
    numero: "",
    habilidades: "",
    imagen: null,
    imagenUrl: "https://via.placeholder.com/150"
  });

  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [setUser]);
  
  useEffect(() => {
    if (!user) {
        return;
    }
    console.log(`Usuario actual: ${user.nombre}`);
    fetch(`http://localhost:8080/usuarios/perfilfreelancer/${user.idusuario}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener el perfil");
            }
            return response.json();
        })
        .then(data => {
            setPerfil(data);
            setFormPerfil({
                nombre: data.nombre,
                edad: data.edad,
                sexo: data.sexo,
                email: data.correo,
                contrasena: data.contrasena,
                numero: data.numero,
                habilidades: data.habilidades,
                imagen: null,
                imagenUrl: data.imagen ? `data:image/png;base64,${data.imagen}` : "https://via.placeholder.com/150"
            });
        })
        .catch(error => console.error("Error al obtener el perfil:", error));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormPerfil({
      ...formPerfil,
      [name]: value
    });
  };

  const handleGuardarPerfil = () => {
    if (!formPerfil.imagen && formPerfil.imagenUrl === "https://via.placeholder.com/150") {
      toast.error("Debes subir una imagen para guardar el perfil.");
      return;
    }
    
    const idUsuario = user.idusuario;
    const perfilActualizado = {
      nombre: formPerfil.nombre,
      edad: formPerfil.edad,
      sexo: formPerfil.sexo,
      correo: formPerfil.email,
      contrasena: formPerfil.contrasena,
      numero: formPerfil.numero,
      habilidades: formPerfil.habilidades,
      imagen: formPerfil.imagen ? formPerfil.imagen : perfil.imagen
    };
    console.log("Perfil actualizado:", perfilActualizado);
  
    fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(perfilActualizado)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => { throw new Error(text); });
      }
      return response.json(); // Esperamos una respuesta JSON válida
    })
    .then(data => {
      console.log("Respuesta del servidor:", data);
      setPerfil(formPerfil);
      setEditMode(false);
      toast.success("Se guardo correctamente tus datos");
      router.reload();
    })
    .catch(error => {
      console.error("Error al guardar el perfil:", error);
      toast.error("Hubo un error al guardar el perfil. Por favor, intenta nuevamente.");
    });
  };

  const handleEditarPerfil = () => {
    setEditMode(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            setFormPerfil({
                ...formPerfil,
                imagen: base64String,
                imagenUrl: reader.result
            });
        };
        reader.readAsDataURL(file);
    }
  };

  if (!perfil) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <LogoBarFreelance />
      <Box className={styles.perfilContainer}>
        <img src={formPerfil.imagenUrl} alt={formPerfil.nombre} className={styles.perfilImage} />
        {!editMode ? (
          <>
            <div className={styles.perfilDetails}>
              <h2>{perfil.nombre}</h2>
              <p>Edad: {perfil.edad}</p>
              <p>Sexo: {perfil.sexo}</p>
              <p>Email: {perfil.correo}</p>
              <p>Contraseña: {perfil.contrasena}</p>
              <p>Número: {perfil.numero}</p>
              <p>Habilidades: {perfil.habilidades}</p>
            </div>
            <Button variant="contained" color="primary" onClick={handleEditarPerfil} className={styles.fullWidthButton}>
              Editar Perfil
            </Button>
          </>
        ) : (
          <form className={styles.formSection}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formPerfil.nombre}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Edad"
              name="edad"
              type="number"
              value={formPerfil.edad}
              fullWidth
              margin="normal"
              disabled
            />
            <FormControl fullWidth margin="normal" required disabled>
              <InputLabel>Sexo</InputLabel>
              <Select
                label="Sexo"
                name="sexo"
                value={formPerfil.sexo}
                onChange={handleChange}
              >
                <MenuItem value="Hombre">Hombre</MenuItem>
                <MenuItem value="Mujer">Mujer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formPerfil.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Contraseña"
              name="contrasena"
              type="password"
              value={formPerfil.contrasena}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Número"
              name="numero"
              value={formPerfil.numero}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Habilidades"
              name="habilidades"
              value={formPerfil.habilidades}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <div className={styles.buttonGroup}>
              <Button
                variant="contained"
                component="label"
                className={styles.uploadButton}
              >
                Subir Imagen
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGuardarPerfil}
                className={styles.saveButton}
              >
                Guardar Perfil
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditMode(false)}
                className={styles.regresarButton}
              >
                Regresar
              </Button>
            </div>
          </form>
        )}
      </Box>
      <ToastContainer />
    </div>
  );
};

export default Perfil;
