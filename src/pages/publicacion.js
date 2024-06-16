import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import LogoBar from "@/components/layout/LogoBar";
import { AppContext } from "@/context/AppContext";

const Formulario = () => {
  const router = useRouter();
  const { user } = useContext(AppContext); // Aquí debe ser 'user' en lugar de 'usuario'
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    categoria: "Selecciona",
    imagen: null,
    fechafin: "",
    ubicacion: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevState) => ({ ...prevState, imagen: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!user) { // Verificar si el usuario está autenticado
      setError("Debes iniciar sesión para publicar una actividad.");
      setIsLoading(false);
      return;
    }

    const idcliente = user.idusuario;
    const fechaFinISO = formData.fechafin
      ? new Date(formData.fechafin).toISOString().split("T")[0]
      : null;

    const trabajoData = new FormData();
    trabajoData.append("idcliente", idcliente);
    trabajoData.append("titulo", formData.titulo);
    trabajoData.append("descripcion", formData.descripcion);
    trabajoData.append("categoria", formData.categoria);
    trabajoData.append("ubicacion", formData.ubicacion);
    trabajoData.append("fechaLimite", fechaFinISO);
    trabajoData.append("estado", "ABIERTO");
    trabajoData.append("presupuesto", 0);
    if (formData.imagen) {
      trabajoData.append("imagen", formData.imagen);
    }

    try {
      const response = await fetch("http://localhost:8080/trabajos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(trabajoData)
    });

      setIsLoading(false);

      if (response.ok) {
        alert("La actividad se ha enviado correctamente");
        router.push("/visualizacionPropuestas");
        setFormData({
          titulo: "",
          descripcion: "",
          categoria: "Selecciona",
          imagen: null,
          fechafin: "",
          ubicacion: "",
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al enviar la actividad");
      }
    } catch (error) {
      setError("Error en la conexión. Inténtalo de nuevo más tarde.");
      console.error(error);
    }
  };
  return (
    <div className="container">
      <LogoBar />
      <h1>Envía tu actividad</h1>
      <p>Por este formulario podrás subir la actividad que deseas resolver</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Nombre de tarea:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción de la tarea:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            rows={6}
            placeholder="Escribe la descripción de la actividad"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ubicacion">Dirección completa:</label>
          <input
            type="text"
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="imagen">Subir imagen:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
          >
            <option value="Selecciona">--Selecciona--</option>
            <option value="Carpinteria">Carpintería</option>
            <option value="Electricista">Electricista</option>
            <option value="Mecanico">Mecánico</option>
            <option value="Plomero">Plomero</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fechafin">Disponibilidad de la tarea:</label>
          <input
            type="date"
            id="fechafin"
            name="fechafin"
            value={formData.fechafin}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Formulario;
