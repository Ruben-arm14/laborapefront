import React from 'react';
import styles from '@/styles/global/MisTrabajosCard.module.css';

const MisTrabajosCard = ({ trabajo, onEdit, onDelete, onContact, onFinalize, onRate }) => {
  const imagenUrl = `http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`;

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este trabajo?')) {
      onDelete(trabajo.idtrabajo);
    }
  };

  const handleContact = () => {
    console.log("Objeto trabajo:", trabajo);
    onContact(trabajo.idtrabajo);
  };

  const renderButtons = () => {
    switch (trabajo.estado) {
      case 'EN_REVISION':
      case 'PUBLICADO':
        return (
          <>
            <button className={styles.editButton} onClick={() => onEdit(trabajo)}>Editar</button>
            <button className={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
          </>
        );
      case 'RECHAZADO':
        return (
          <button className={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
        );
      case 'ACEPTADO':
      case 'EN_PROCESO':
        return (
          <>
            <button className={styles.contactButton} onClick={handleContact}>Ver Contacto</button>
            {trabajo.estado === 'EN_PROCESO' && (
              <button className={styles.finalizeButton} onClick={() => onFinalize(trabajo.idtrabajo)}>Finalizar</button>
            )}
          </>
        );
      case 'FINALIZADO':
        return (
          <button className={styles.rateButton} onClick={() => onRate(trabajo.idtrabajo)}>Calificar</button>
        );
      case 'CALIFICADO':
        return (
          <p>Este trabajo ya fue calificado</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.card}>
      <img src={imagenUrl} alt={trabajo.titulo} className={styles.image} />
      <h2>{trabajo.titulo}</h2>
      <p>{trabajo.descripcion}</p>
      <p>Ubicación: {trabajo.ubicacion}</p>
      <p className={styles.budget}>Presupuesto: {trabajo.presupuesto}</p>
      <p>Fecha Límite: {new Date(trabajo.fechaLimite).toLocaleString()}</p>
      <p>Categoría: {trabajo.categoria}</p>
      <p>Estado: {trabajo.estado}</p>
      <div className={styles.actions}>
        {renderButtons()}
      </div>
    </div>
  );
};

export default MisTrabajosCard;
