import React, { useState, useEffect, useContext } from 'react';
import { Box, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import MisTrabajosCard from '@/components/trabajos/MisTrabajosCard';
import LogoBar from '@/components/layout/LogoBar';
import { AppContext } from '@/context/AppContext';
import EditarTrabajoModal from '@/components/trabajos/EditarTrabajoModal';
import Pagination from '@mui/material/Pagination';
import styles from '@/styles/global/misTrabajos.module.css';

const MisTrabajos = () => {
  const { user, setUser } = useContext(AppContext);
  const [trabajos, setTrabajos] = useState([]);
  const [error, setError] = useState(null);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState('EN_REVISION'); // Estado por defecto
  const itemsPerPage = 4;

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, [setUser]);

  useEffect(() => {
    const fetchTrabajos = async () => {
      if (!user) {
        setError("Debes iniciar sesión para ver tus trabajos.");
        return;
      }

      try {
        // Asumimos que user.idusuario es el ID del usuario
        // Se debe obtener el clienteId basado en el idusuario
        const responseCliente = await fetch(`http://localhost:8080/clientes/usuario/${user.idusuario}`);
        if (!responseCliente.ok) {
          throw new Error("Error al obtener cliente");
        }
        const cliente = await responseCliente.json();

        const response = await fetch(`http://localhost:8080/trabajos/estado/${estadoFiltro}?clienteId=${cliente.idcliente}`);
        if (!response.ok) {
          throw new Error("Error HTTP! status: " + response.status);
        }
        const data = await response.json();
        setTrabajos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (user) {
      fetchTrabajos();
    }
  }, [user, estadoFiltro]);

  const handleEdit = (trabajo) => {
    setTrabajoSeleccionado(trabajo);
  };

  const handleDelete = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      setTrabajos(trabajos.filter(trabajo => trabajo.idtrabajo !== idtrabajo));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleContact = async (idfreelancer) => {
    try {
      const response = await fetch(`http://localhost:8080/freelancers/${idfreelancer}`);
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      const data = await response.json();
      // manejar la lógica de los contactos aquí
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccept = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/aceptar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      // Actualizar el estado de los trabajos aquí
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalize = async (idtrabajo) => {
    try {
      const response = await fetch(`http://localhost:8080/trabajos/${idtrabajo}/finalizar`, {
        method: 'PUT'
      });
      if (!response.ok) {
        throw new Error("Error HTTP! status: " + response.status);
      }
      // Actualizar el estado de los trabajos aquí
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRate = (idtrabajo) => {
    // lógica para calificar el trabajo
  };

  const closeModal = () => {
    setTrabajoSeleccionado(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleEstadoChange = (event) => {
    setEstadoFiltro(event.target.value);
  };

  const paginatedTrabajos = trabajos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="container">
      <LogoBar />
      <h1 className={styles.title}>Mis Trabajos</h1>
      <div className={styles.filterContainer}>
        <FormControl variant="outlined" className={styles.formControl}>
          <InputLabel id="estado-filter-label">Estado</InputLabel>
          <Select
            labelId="estado-filter-label"
            value={estadoFiltro}
            onChange={handleEstadoChange}
            label="Estado"
          >
            <MenuItem value="EN_REVISION">En Revisión</MenuItem>
            <MenuItem value="RECHAZADO">Rechazado</MenuItem>
            <MenuItem value="PUBLICADO">Publicado</MenuItem>
            <MenuItem value="ACEPTADO">Aceptado</MenuItem>
            <MenuItem value="EN_PROCESO">En Proceso</MenuItem>
            <MenuItem value="FINALIZADO">Finalizado</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Box className={styles.trabajosContainer}>
        {error && <Alert severity="error">{error}</Alert>}
        {trabajos.length === 0 && !error && <Alert severity="info">Por el momento no tienes trabajos con ese estado.</Alert>}
        <div className={styles.cardContainer}>
          {paginatedTrabajos.map((trabajo) => (
            <MisTrabajosCard
              key={trabajo.idtrabajo}
              trabajo={trabajo}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onContact={handleContact}
              onAccept={handleAccept}
              onFinalize={handleFinalize}
              onRate={handleRate}
            />
          ))}
        </div>
      </Box>
      <div className={styles.paginationContainer}>
        <Pagination count={Math.ceil(trabajos.length / itemsPerPage)} page={page} onChange={handlePageChange} />
      </div>
      {trabajoSeleccionado && (
        <EditarTrabajoModal
          trabajo={trabajoSeleccionado}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MisTrabajos;
