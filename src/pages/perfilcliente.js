// pages/perfilCliente.js

import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styles from '@/styles/global/perfilcliente.module.css';
import LogoBar from '@/components/layout/LogoBar';

const PerfilCliente = () => {
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    nombre: "",
    edad: "",
    sexo: "",
    email: "",
    numero: "",
    imagenUrl: "https://via.placeholder.com/150"
  });

  useEffect(() => {
    const idUsuario = localStorage.getItem("idusuario");
    console.log("ID del usuario:", idUsuario); // Verifica que el ID esté correctamente almacenado

    if (idUsuario) {
      const url = `http://localhost:8080/usuarios/perfil/${idUsuario}`;
      console.log("URL de la solicitud:", url); // Verifica la URL de la solicitud

      fetch(url)
        .then(response => {
          console.log("Respuesta de la API:", response); // Verifica la respuesta de la API
          if (!response.ok) {
            throw new Error("Error al obtener el perfil");
          }
          return response.json();
        })
        .then(data => {
          console.log("Datos obtenidos del perfil:", data); // Verifica los datos obtenidos
          setPerfil(data);
          setFormPerfil({
            nombre: data.nombre,
            edad: data.edad,
            sexo: data.sexo,
            email: data.correo,
            numero: data.numeroCelular,
            imagenUrl: "https://via.placeholder.com/150"
          });
        })
        .catch(error => console.error("Error al obtener el perfil:", error));
    }
  }, []);

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
          imagenUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardarPerfil = () => {
    setPerfil(formPerfil);
    setEditMode(false);

    // Actualizar el perfil en el backend
    const idUsuario = localStorage.getItem("idusuario");
    fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPerfil)
    }).catch(error => console.error("Error al guardar el perfil:", error));
  };

  const handleEditarPerfil = () => {
    setEditMode(true);
  };

  if (!perfil) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <LogoBar />
      <Box className={styles.perfilContainer}>
        <img src={formPerfil.imagenUrl} alt={formPerfil.nombre} className={styles.perfilImage} />
        {!editMode ? (
          <>
            <div className={styles.perfilDetails}>
              <h2>{perfil.nombre}</h2>
              <p>Edad: {perfil.edad}</p>
              <p>Sexo: {perfil.sexo}</p>
              <p>Email: {perfil.correo}</p>
              <p>Número: {perfil.numeroCelular}</p>
            </div>
            <Button variant="contained" color="primary" onClick={handleEditarPerfil} className={styles.fullWidthButton}>
              Editar Perfil
            </Button>
          </>
        ) : (
          <form className={styles.form}>
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
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal" required>
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
              label="Número"
              name="numero"
              value={formPerfil.numero}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              className={styles.uploadButton}
            >
              Subir Imagen
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGuardarPerfil}
              fullWidth
              className={styles.fullWidthButton}
            >
              Guardar Perfil
            </Button>
          </form>
        )}
      </Box>
    </div>
  );
};

export default PerfilCliente;

