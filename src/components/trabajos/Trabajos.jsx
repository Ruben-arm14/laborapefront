import React, { useState } from 'react';
import TrabajoItem from './TrabajoItem';

const Trabajos = ({ trabajos, onPostular }) => {
  return (
    <div>
      <h2>Trabajos Disponibles</h2>
      {trabajos && trabajos.length > 0 ? (
        trabajos.map(trabajo => (
        <TrabajoItem key={trabajo.id} trabajo={trabajo} onPostular={onPostular} />
         ))
) : (
  <p>No hay trabajos disponibles</p>
)}
    </div>
  );
};

export default Trabajos;