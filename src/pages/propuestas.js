import React, { useEffect, useState, useContext } from "react";
import { Box, Grid, Pagination, CircularProgress, Alert } from "@mui/material";
import { AppContext } from "@/context/AppContext";
import { getPropuestas, enviarPropuesta } from "@/services/apiService";
import PropuestaCard from "@/components/propuestas/PropuestaCard";
import LogoBar from "@/components/layout/LogoBar";
import DetallePropuesta from "@/components/propuestas/DetallePropuesta";

const itemsPerPage = 4;

const Propuestas = () => {
  const { user } = useContext(AppContext); // Obtén el usuario del contexto
  const [propuestas, setPropuestas] = useState([]);
  const [page, setPage] = useState(1);
  const [openMasDetalle, setOpenMasDetalle] = useState(false);
  const [propuestaSelected, setPropuestaSelected] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPropuestas = async () => {
      try {
        const response = await getPropuestas();
        if (response.ok) {
          setPropuestas(response.data);
        } else {
          throw new Error("Error al obtener propuestas");
        }
      } catch (error) {
        console.error("Error al cargar las propuestas:", error);
        setError(
          "No se pudieron cargar las propuestas. Por favor, inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropuestas();
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleVerDetalle = (id) => {
    setOpenMasDetalle(true);
    setPropuestaSelected(propuestas.find((propuesta) => propuesta.id === id) || {});
  };

  const handleCloseDetalle = () => {
    setOpenMasDetalle(false);
  };

  const handleEnviarPropuesta = async (propuestaData) => {
    try {
      // Agregar el id del freelancer a los datos de la propuesta
      propuestaData.idfreelancer = user.idusuario; // Suponiendo que el id del usuario está en el contexto

      const response = await enviarPropuesta(propuestaData);
      if (response.ok) {
        console.log("Propuesta enviada con éxito");
        handleCloseDetalle(); 
        // Aquí puedes actualizar la lista de propuestas si es necesario
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al enviar la propuesta");
      }
    } catch (error) {
      setError("Error al enviar la propuesta. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <LogoBar />
      <h1>Propuestas de trabajo</h1>

      {isLoading ? ( 
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress /> {/* Indicador de carga */}
        </Box>
      ) : error ? ( // Mostrar mensaje de error si hay un error
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {propuestas
              .filter((c, index) => (page - 1) * itemsPerPage <= index && index < page * itemsPerPage)
              .map((item, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ border: '1px solid grey', padding: 2, borderRadius: 2 }}>
                    <PropuestaCard
                      id={item.id}
                      nombre={item.titulo} // Cambiado a 'titulo' para que coincida con el backend
                      descripcion={item.descripcion}
                      image={`/imagenes/${item.imagen}`}
                      detalle={() => handleVerDetalle(item.id)}
                    />
                  </Box>
                </Grid>
              ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
            <Pagination
              count={Math.ceil(propuestas.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </Box>
      )}

      <DetallePropuesta
        open={openMasDetalle}
        handleClose={handleCloseDetalle}
        propuesta={propuestaSelected}
        enviar={enviarPropuesta} 
      />
    </div>
  );
};

export default Propuestas;
