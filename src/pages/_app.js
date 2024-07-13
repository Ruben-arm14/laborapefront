import React from 'react';
import { AppProvider } from '../context/AppContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/global/login.module.css';
import '../styles/global/register.module.css';
import '../styles/global/global.css';
import '../styles/global/postulacionFree.css';
import '../styles/global/LogoBar.module.css';
import '../styles/global/Formulario.module.css';
import '../styles/global/misTrabajos.module.css';
import '../styles/global/MisTrabajosCard.module.css';
import '../styles/global/EditarTrabajoModal.module.css';
import '../styles/global/PropuestaCard.module.css'
import '../styles/global/postularPopup.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </AppProvider>
  );
}

export default MyApp;
