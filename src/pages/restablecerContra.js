import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/global/resetpassword.module.css"; // Asegúrate de que la ruta sea correcta

const ResetPasswordForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", Newpassword: "", Repetirpassword: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.Newpassword || !formData.Repetirpassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (formData.Newpassword !== formData.Repetirpassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/reset-password", { // Reemplaza con tu endpoint real
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Se cambió con éxito la contraseña", {
          position: "top-center",  // Aquí se corrige la posición de la notificación
          autoClose: 5000,
          onClose: () => router.push("/login")
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Ocurrió un error al restablecer la contraseña.");
      }
    } catch (error) {
      setError("Ocurrió un error. Por favor, inténtelo de nuevo más tarde.");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.left_side}>
        <img src="/imagenes/logolaborape.png" alt="LaboraPE Logo" className={styles.logo} />
        <p className={styles.slogan}>Encontrar chamba nunca fue tan fácil</p>
      </div>
      <div className={styles.right_side}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Restablecer Contraseña</h2>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="email">Email</label>
            <input
              placeholder="Ingrese su email"
              id="email"
              className={styles.form_style}
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="Newpassword">Nueva Contraseña</label>
            <input
              placeholder="Ingrese su nueva contraseña"
              id="Newpassword"
              className={styles.form_style}
              type="password"
              value={formData.Newpassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="Repetirpassword">Repetir Contraseña</label>
            <input
              placeholder="Repita su nueva contraseña"
              id="Repetirpassword"
              className={styles.form_style}
              type="password"
              value={formData.Repetirpassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button className={styles.btn} type="submit">RESTABLECER CONTRASEÑA</button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
