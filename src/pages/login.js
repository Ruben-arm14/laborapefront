import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AppContext } from "@/context/AppContext";
import Link from "next/link";
import styles from "@/styles/global/login.module.css";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, setClienteId, setFreelancerId } = useContext(AppContext);
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
        body: JSON.stringify({
          correo: formData.correo,
          contrasena: formData.contrasenia
        }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.usuario);
        sessionStorage.setItem('usuario', JSON.stringify(userData.usuario)); // Cambiado a sessionStorage
        
        if (userData.usuario.rol === 'CLIENTE') {
          setClienteId(userData.idcliente);
          sessionStorage.setItem('clienteId', userData.idcliente);
          router.push('/publicacion');
        } else if (userData.usuario.rol === 'FREELANCER') {
          const freelancerResponse = await fetch(`http://localhost:8080/usuarios/perfilfreelancer/${userData.usuario.idusuario}`);
          if (freelancerResponse.ok) {
            const freelancerData = await freelancerResponse.json();
            setFreelancerId(freelancerData.idfreelancer);
            sessionStorage.setItem('freelancerId', freelancerData.idfreelancer);
            router.push('/trabajosFreelancer');
          } else {
            setError("Error al obtener datos del freelancer.");
          }
        } else if (userData.usuario.rol === 'ADMIN') {
          router.push('/trabajosadmin');
        }
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
    <div className={styles.container}>
      <div className={styles.left_side}>
        <img src="/imagenes/logolaborape.png" alt="LaboraPE Logo" className={styles.logo} />
        <p className={styles.slogan}>Encontrar chamba nunca fue tan fácil</p>
      </div>
      <div className={styles.right_side}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2 className={styles.title}>Bienvenido a LaboraPE</h2>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="correo">
              Email
            </label>
            <input
              placeholder="Ingrese su email"
              id="correo"
              className={styles.form_style}
              type="email"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="contrasenia">
              Contraseña
            </label>
            <input
              placeholder="Ingrese su contraseña"
              id="contrasenia"
              className={styles.form_style}
              type="password"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <button className={styles.btn} type="submit" disabled={isLoading}>
              {isLoading ? 'INGRESANDO...' : 'INGRESAR'}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <p>
              <Link className={styles.link} href="/restablecerContra">
                RESTABLECER CONTRASEÑA
              </Link>
            </p>
            <p>
              <Link className={styles.link} href="/register">
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
