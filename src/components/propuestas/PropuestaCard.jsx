import React from 'react';
import styles from '@/styles/global/PropuestaCard.module.css';

const PropuestaCard = ({ propuesta, onAccept, onReject, onOffer }) => {
  return (
    <div className={styles.card}>
      <img src={propuesta.imagen} alt={propuesta.freelancer} className={styles.image} />
      <div className={styles.info}>
        <h3>{propuesta.freelancer}</h3>
        <p>Edad: {propuesta.edad}</p>
        <p>{propuesta.descripcion}</p>
        <p><strong>{propuesta.trabajo}</strong></p>
      </div>
      <div className={styles.actions}>
        <button className={styles.acceptButton} onClick={() => onAccept(propuesta.id)}>Aceptar</button>
        <button className={styles.rejectButton} onClick={() => onReject(propuesta.id)}>Rechazar</button>
        <button className={styles.offerButton} onClick={() => onOffer(propuesta.id)}>Ofrecer Propuesta</button>
      </div>
    </div>
  );
};

export default PropuestaCard;
