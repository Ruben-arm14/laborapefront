import React from 'react';
import styles from '@/styles/global/MisTrabajosCard.module.css';

const MisTrabajosCard = ({ trabajo, onEdit, onDelete }) => {
  const imagenUrl = `http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`;

  return (
    <div className={styles.card}>
      <img src={imagenUrl} alt={trabajo.titulo} className={styles.image} />
      <h2>{trabajo.titulo}</h2>
      <p>{trabajo.descripcion}</p>
      <p>Ubicación: {trabajo.ubicacion}</p>
      <p className={styles.budget}>Presupuesto: {trabajo.presupuesto}</p>
      <p>Estado: {trabajo.estado}</p>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => onEdit(trabajo)}>Editar</button>
        <button className={styles.deleteButton} onClick={() => onDelete(trabajo.idtrabajo)}>Eliminar</button>
      </div>
    </div>
  );
};

export default MisTrabajosCard;
