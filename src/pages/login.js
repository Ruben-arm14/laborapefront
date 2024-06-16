import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useContext(AppContext);
  const [formData, setFormData] = useState({ correo: "", contrasenia: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('usuario', JSON.stringify(userData));

        // Redireccionar según el rol del usuario
        router.push(userData.rol === 'CLIENTE' ? '/visualizacionPropuestas' : '/propuestas'); 
      } else {
        const errorData = await response.json(); 
        setError(errorData.error || "Credenciales incorrectas"); 
      }
    } catch (error) {
      setError("Error en el servidor. Inténtalo de nuevo más tarde.");
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="container">
      <div className="form_area">
        <p className="title">LaboraPE</p>
        <form onSubmit={handleSubmit}>
          {/* Campos del formulario */}
          <div className="form_group">
            <label className="sub_title" htmlFor="correo">
              Email
            </label>
            <input
              placeholder="Ingrese su email"
              id="correo"
              className="form_style"
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form_group">
            <label className="sub_title" htmlFor="contrasenia">
              Contraseña
            </label>
            <input
              placeholder="Ingrese su contraseña"
              id="contrasenia" 
              className="form_style"
              type="password"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button className="btn" type="submit" disabled={isLoading}>
              {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
            {error && <p className="error-message">{error}</p>}
            <p>
              <Link className="link" href="/restablecerContra">
                RESTABLECER CONTRASEÑA
              </Link>
            </p>
            <p>
              <Link className="link" href="/register">
                CREAR NUEVA CUENTA
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
