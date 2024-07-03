import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styles from '@/styles/global/perfilcliente.module.css';
import LogoBar from '@/components/layout/LogoBar';
import { AppContext } from "@/context/AppContext";

const PerfilCliente = () => {
  const { user } = useContext(AppContext);
  const [perfil, setPerfil] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
            imagenUrl: data.imagenUrl || `http://localhost:8080/usuarios/${idUsuario}/imagen`
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
        alert("Perfil actualizado correctamente");
        setEditMode(false);
      } else {
        const errorData = await response.json();
        alert(`Error al guardar el perfil: ${errorData.error || "Error desconocido"}`);
      }
    } catch (error) {
      alert(`Error al guardar el perfil: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <LogoBar />
      {perfil && (
        <div className={styles.perfilContainer}>
          <img 
            src={formPerfil.imagenUrl || "/images/default-profile.png"} 
            alt="Imagen del perfil" 
            className={styles.perfilImage} 
          />
          {editMode ? (
            <form>
              <TextField
                label="Nombre"
                name="nombre"
                value={formPerfil.nombre}
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
              <FormControl fullWidth margin="normal" disabled>
                <InputLabel>Sexo</InputLabel>
                <Select
                  name="sexo"
                  value={formPerfil.sexo}
                  required
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
                required
                margin="normal"
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
                label="Contraseña"
                name="contrasena"
                type="password"
                value={formPerfil.contrasena}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Rol"
                name="rol"
                value={perfil.rol}
                fullWidth
                required
                margin="normal"
                disabled // Deshabilitar el cambio de rol
              />
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="raised-button-file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" className={styles.uploadButton}>
                  Subir Imagen
                </Button>
              </label>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGuardarPerfil}
                disabled={isLoading}
                className={styles.fullWidthButton}
              >
                {isLoading ? 'Guardando...' : 'Guardar Perfil'}
              </Button>
            </form>
          ) : (
            <div>
              <div className={styles.perfilDetails}>
                <p>Nombre: {perfil.nombre}</p>
                <p>Edad: {perfil.edad}</p>
                <p>Sexo: {perfil.sexo}</p>
                <p>Email: {perfil.correo}</p>
                <p>Número: {perfil.numero}</p>
                <p>Rol: {perfil.rol}</p> {/* Mostrar el rol */}
              </div>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                className={styles.fullWidthButton}
              >
                Editar Perfil
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerfilCliente;
