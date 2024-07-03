import React, { useState } from 'react';
import styles from '@/styles/global/MisTrabajosCard.module.css';

const MisTrabajosCard = ({ trabajo, onEdit, onDelete, onContact, onAccept, onFinalize, onRate }) => {
  const imagenUrl = `http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`;
  const [showContact, setShowContact] = useState(false);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este trabajo?')) {
      onDelete(trabajo.idtrabajo);
    }
  };

  const handleContact = () => {
    setShowContact(true);
    onContact(trabajo.idfreelancer);
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
        return (
          <>
            <button className={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
            <button className={styles.contactButton} onClick={handleContact}>Ver Contacto</button>
            {showContact && trabajo.freelancer && (
              <div className={styles.contactInfo}>
                <p>Nombre: {trabajo.freelancer.nombre}</p>
                <p>Correo: {trabajo.freelancer.correo}</p>
                <p>Teléfono: {trabajo.freelancer.numero}</p>
                <button className={styles.acceptButton} onClick={() => onAccept(trabajo.idtrabajo)}>Aceptar</button>
              </div>
            )}
          </>
        );
      case 'EN_PROCESO':
        return (
          <>
            <button className={styles.contactButton} onClick={handleContact}>Ver Contacto</button>
            <button className={styles.finalizeButton} onClick={() => onFinalize(trabajo.idtrabajo)}>Finalizar</button>
            {showContact && trabajo.freelancer && (
              <div className={styles.contactInfo}>
                <p>Nombre: {trabajo.freelancer.nombre}</p>
                <p>Correo: {trabajo.freelancer.correo}</p>
                <p>Teléfono: {trabajo.freelancer.numero}</p>
              </div>
            )}
          </>
        );
      case 'FINALIZADO':
        return (
          <button className={styles.rateButton} onClick={() => onRate(trabajo.idtrabajo)}>Calificar</button>
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
      {trabajo.freelancer && (trabajo.estado === 'ACEPTADO' || trabajo.estado === 'EN_PROCESO' || trabajo.estado === 'FINALIZADO') ? (
        <p>Freelancer: {trabajo.freelancer.nombre}</p>
      ) : null}
      <div className={styles.actions}>
        {renderButtons()}
      </div>
    </div>
  );
};

export default MisTrabajosCard;
