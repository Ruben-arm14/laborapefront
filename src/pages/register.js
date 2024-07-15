import { useState } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/styles/global/register.module.css"; // Asegúrate de crear y usar un archivo CSS para este formulario

const RegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasenia: "",
    rol: "CLIENTE", // Valor por defecto CLIENTE
    edad: "",
    sexo: "Hombre", // Valor por defecto Hombre
    numero: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    // Expresión regular para validar un correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  // Validaciones adicionales
  if (!validateEmail(formData.correo)) {
    setError("El correo debe tener un formato válido.");
    setIsLoading(false);
    return;
  }

  if (!validatePassword(formData.contrasenia)) {
    setError("La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.");
    setIsLoading(false);
    return;
  }

  if (formData.edad < 18 || formData.edad > 70) {
    setError("La edad debe estar entre 18 y 70 años.");
    setIsLoading(false);
    return;
  }

  if (!/^\d{9}$/.test(formData.numero)) {
    setError("El número debe tener exactamente 9 dígitos.");
    setIsLoading(false);
    return;
  }

  if (!formData.nombre || !formData.correo || !formData.contrasenia || !formData.edad || !formData.sexo || !formData.numero) {
    setError("Por favor, completa todos los campos.");
    setIsLoading(false);
    return;
  }

  try {
    const responseUsuario = await fetch("http://localhost:8080/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasenia,
        rol: formData.rol,
        edad: formData.edad,
        sexo: formData.sexo,
        numero: formData.numero,
      }),
    });

    if (!responseUsuario.ok) {
      const errorData = await responseUsuario.json();
      if (responseUsuario.status === 409) {
        throw new Error("El correo ya tiene una cuenta.");
      } else {
        throw new Error(errorData.error || "Error al crear el usuario.");
      }
    }

    const dataUsuario = await responseUsuario.json();

    if (dataUsuario.rol === "FREELANCER") {
      await crearFreelancer(dataUsuario.idusuario);
    } else if (dataUsuario.rol === "CLIENTE") {
      await crearCliente(dataUsuario.idusuario, formData.nombre);
    }

    toast.success("Tu usuario fue registrado correctamente", {
      position: "top-center",
      autoClose: 3000,
      onClose: () => router.push("/login")
    });
  } catch (error) {
    setError(error.message);
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};


  const crearCliente = async (idusuario, nombre) => {
    const responseCliente = await fetch("http://localhost:8080/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idusuario, nombre }),
    });

    if (!responseCliente.ok) {
      const errorData = await responseCliente.json();
      throw new Error(errorData.error || "Error al crear el cliente.");
    }

    return responseCliente.json();
  };

  const crearFreelancer = async (idusuario) => {
    const responseFreelancer = await fetch("http://localhost:8080/freelancers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idusuario }),
    });

    if (!responseFreelancer.ok) {
      const errorData = await responseFreelancer.json();
      throw new Error(errorData.error || "Error al crear el freelancer.");
    }

    return responseFreelancer.json();
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.left_side}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <p className={styles.title}>REGISTRO</p>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="nombre">Nombre Completo</label>
            <input
              placeholder="Introduzca su nombre"
              className={styles.form_style}
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="correo">Correo</label>
            <input
              placeholder="Introduzca un correo"
              className={styles.form_style}
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="contrasenia">Contraseña</label>
            <input
              placeholder="Introduzca una contraseña"
              className={styles.form_style}
              type="password"
              name="contrasenia"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="edad">Edad</label>
            <input
              placeholder="Introduzca su edad"
              className={styles.form_style}
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="sexo">Sexo</label>
            <select
              name="sexo"
              className={styles.form_style}
              value={formData.sexo}
              onChange={handleChange}
              required
            >
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="numero">Número</label>
            <input
              placeholder="Introduzca su número"
              className={styles.form_style}
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              maxLength={9} // Restricción de longitud máxima
            />
          </div>
          <div className={styles.form_group}>
            <label className={styles.sub_title} htmlFor="rol">¿Qué desea en la app?</label>
            <select
              name="rol"
              className={styles.form_style}
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="CLIENTE">CLIENTE</option>
              <option value="FREELANCER">FREELANCER</option>
            </select>
          </div>
          <div>
            <button className={styles.btn} type="submit" disabled={isLoading}>
              {isLoading ? "Cargando..." : "CREAR CUENTA"}
            </button>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </form>
      </div>

      <div className={styles.right_side}>
        <img src="/imagenes/logolaborape.png" alt="LaboraPE Logo" className={styles.logo} />
        <p className={styles.slogan}>Encontrar chamba nunca fue tan fácil</p>
      </div>
    </div>
  );
};

export default RegistrationForm;
