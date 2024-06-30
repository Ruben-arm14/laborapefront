import React from 'react';
import { Box, Grid } from '@mui/material';
import LogoBar from '@/components/layout/LogoBar';
import styles from '@/styles/global/verPropuestas.module.css';

const VerPropuestas = () => {
  const propuestas = [
    {
      freelancer: {
        nombre: "Freelancer 1",
        edad: 30,
        calificacion: 4.5,
        experiencia: "5 años",
        habilidades: "React, Node.js, CSS",
        disponibilidad: "Inmediata",
        imagenUrl: "https://via.placeholder.com/150"
      },
      descripcion: "Esta es la descripción de la propuesta 1",
      trabajo: "Trabajo 1",
      presupuesto: "$1000"
    },
    {
      freelancer: {
        nombre: "Freelancer 2",
        edad: 25,
        calificacion: 4,
        experiencia: "3 años",
        habilidades: "Java, Spring, HTML",
        disponibilidad: "2 semanas",
        imagenUrl: "https://via.placeholder.com/150"
      },
      descripcion: "Esta es la descripción de la propuesta 2",
      trabajo: "Trabajo 2",
      presupuesto: "$1200"
    },
    {
      freelancer: {
        nombre: "Freelancer 3",
        edad: 35,
        calificacion: 4.8,
        experiencia: "7 años",
        habilidades: "Python, Django, AWS",
        disponibilidad: "1 mes",
        imagenUrl: "https://via.placeholder.com/150"
      },
      descripcion: "Esta es la descripción de la propuesta 3",
      trabajo: "Trabajo 3",
      presupuesto: "$1500"
    }
  ];

  return (
    <div className={styles.bodyNoMargin}>
      <LogoBar />
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Propuestas de trabajo</h1>
        <Box className={styles.propuestasContainer}>
          <Grid container spacing={2} direction="column">
            {propuestas.map((propuesta, index) => (
              <Grid item key={index} className={styles.propuestaItem}>
                <div className={styles.freelancerInfo}>
                  <img src={propuesta.freelancer.imagenUrl} alt={propuesta.freelancer.nombre} className={styles.freelancerImage} />
                  <div className={styles.freelancerDetails}>
                    <h2>{propuesta.freelancer.nombre}</h2>
                    <p>Edad: {propuesta.freelancer.edad}</p>
                    <p>Calificación: {propuesta.freelancer.calificacion}</p>
                    <p>Experiencia: {propuesta.freelancer.experiencia}</p>
                    <p>Habilidades: {propuesta.freelancer.habilidades}</p>
                    <p>Disponibilidad: {propuesta.freelancer.disponibilidad}</p>
                    <p>{propuesta.descripcion}</p>
                  </div>
                </div>
                <div className={styles.trabajoDetails}>
                  <h4>Trabajo:</h4>
                  <p>{propuesta.trabajo}</p>
                  <h4>Presupuesto:</h4>
                  <p>{propuesta.presupuesto}</p>
                </div>
                <div className={styles.buttonsContainer}>
                  <button className={styles.acceptButton}>ACEPTAR</button>
                  <button className={styles.rejectButton}>RECHAZAR</button>
                  <button className={styles.offerButton}>OFRECER PROPUESTA</button>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default VerPropuestas;
