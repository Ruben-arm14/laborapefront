import { useState } from "react";
import { useRouter } from "next/router";

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

    // Validación básica (puedes agregar más validaciones según tus requisitos)
    if (!formData.email || !formData.Newpassword || !formData.Repetirpassword) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    if (formData.Newpassword !== formData.Repetirpassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", { // Reemplaza con tu endpoint real
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Restablecimiento de contraseña exitoso
        const data = await response.json();
        router.push("/login");
      } else {
        // Error en el restablecimiento de contraseña
        const errorData = await response.json();
        setError(errorData.message || "Ocurrió un error al restablecer la contraseña.");
      }
    } catch (error) {
      // Error en la conexión o en el servidor
      setError("Ocurrió un error. Por favor, inténtelo de nuevo más tarde.");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="form_area">
        <p className="title">LaboraPE</p>
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label className="sub_title" htmlFor="email">
              Email
            </label>
            <input
              placeholder="Ingrese su email"
              id="email"
              className="form_style"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="Newpassword">
              Nueva Contraseña
            </label>
            <input
              placeholder="Ingrese su nueva contraseña"
              id="Newpassword"
              className="form_style"
              type="password"
              value={formData.Newpassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="Repetirpassword">
              Repetir Contraseña
            </label>
            <input
              placeholder="Repita su nueva contraseña"
              id="Repetirpassword"
              className="form_style"
              type="password"
              value={formData.Repetirpassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button className="btn" type="submit">
              RESTABLECER CONTRASEÑA
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm; 
