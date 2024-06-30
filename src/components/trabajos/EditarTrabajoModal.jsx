import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '@/context/AppContext';
import styles from '@/styles/global/EditarTrabajoModal.module.css';

const EditarTrabajoModal = ({ trabajo, onClose }) => {
  const { user } = useContext(AppContext);
  const [formData, setFormData] = useState({
    titulo: trabajo.titulo || '',
    descripcion: trabajo.descripcion || '',
    categoria: trabajo.categoria || '',
    ubicacion: trabajo.ubicacion || '',
    fechaLimite: trabajo.fechaLimite ? new Date(trabajo.fechaLimite).toISOString().split('T')[0] : '',
    presupuesto: trabajo.presupuesto || '',
    imagen: null,
    idcliente: trabajo.cliente ? trabajo.cliente.idcliente : (user ? user.idusuario : '')
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (trabajo && trabajo.cliente && trabajo.cliente.idcliente) {
      setFormData((prevState) => ({
        ...prevState,
        idcliente: trabajo.cliente.idcliente,
      }));
    } else if (user) {
      setFormData((prevState) => ({
        ...prevState,
        idcliente: user.idusuario,
      }));
    }
  }, [trabajo, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setFormData({ ...formData, imagen: file });
      setError(null);
    } else {
      setError('Solo se permiten archivos de imagen en formato PNG o JPG.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('trabajoData', JSON.stringify({
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      categoria: formData.categoria,
      ubicacion: formData.ubicacion,
      fechaLimite: formData.fechaLimite,
      presupuesto: formData.presupuesto,
      estado: trabajo.estado,
      idcliente: formData.idcliente,
    }));
    if (formData.imagen) {
      data.append('imagen', formData.imagen);
    }

    try {
      const response = await fetch(`http://localhost:8080/trabajos/${trabajo.idtrabajo}`, {
        method: 'PUT',
        body: data,
      });
      if (response.ok) {
        alert('Trabajo actualizado con éxito');
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el trabajo: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error updating trabajo:', error);
      alert('Error al actualizar el trabajo');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Editar Trabajo</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageContainer}>
            <img src={`http://localhost:8080/trabajos/${trabajo.idtrabajo}/imagen`} alt="Trabajo" className={styles.image}/>
          </div>
          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label>Título</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className={styles.textarea}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Categoría</label>
              <input
                type="text"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Ubicación</label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Fecha Límite</label>
              <input
                type="date"
                name="fechaLimite"
                value={formData.fechaLimite}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Presupuesto</label>
              <input
                type="text"
                name="presupuesto"
                value={formData.presupuesto}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Imagen</label>
              <input
                type="file"
                name="imagen"
                accept="image/png, image/jpeg"
                onChange={handleImageChange}
                className={styles.input}
              />
              {error && <p className={styles.error}>{error}</p>}
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>Guardar Cambios</button>
              <button type="button" onClick={onClose} className={styles.cancelButton}>Cancelar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarTrabajoModal;
