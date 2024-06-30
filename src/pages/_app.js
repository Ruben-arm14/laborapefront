import React from 'react';
import { AppProvider } from '../context/AppContext';
import '../styles/global/login.module.css';
import '../styles/global/register.css';
import '../styles/global/postulacionFree.css';
import '../styles/global/LogoBar.module.css';
import '../styles/global/Formulario.module.css';
import '../styles/global/misTrabajos.module.css';
import '../styles/global/MisTrabajosCard.module.css';
import '../styles/global/EditarTrabajoModal.module.css';
import '../styles/global/PropuestaCard.module.css'

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;