import React, { useState } from 'react';
import EditarTrabajoModal from './EditarTrabajoModal';

const TrabajoItem = ({ trabajo, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="trabajo-item">
      <h2>{trabajo.titulo}</h2>
      <p>{trabajo.descripcion}</p>
      <button onClick={() => setShowEditModal(true)}>Editar</button>
      <button onClick={() => onDelete(trabajo.idtrabajo)}>Eliminar</button>
      {showEditModal && (
        <EditarTrabajoModal
          trabajo={trabajo}
          onClose={() => setShowEditModal(false)}
          onSave={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default TrabajoItem;
