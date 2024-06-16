// apiService.js
import axios from 'axios'; // Si decides usar Axios, asegúrate de instalarlo con 'npm install axios'

const API_URL = 'http://localhost:3100/api'; // Reemplaza con la URL de tu API real

export const getPropuestas = async () => {
  try {
    const response = await fetch("http://localhost:8080/trabajos", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Error al obtener propuestas");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener las propuestas:", error);
    throw error;
  }
};

export const enviarPropuesta = async (data) => {
  try {
    const response = await fetch("http://localhost:8080/propuestas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error al enviar la propuesta:", error);
    throw error;
  }
};

// Agrega otras funciones para interactuar con tu API según sea necesario
