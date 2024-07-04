import { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [clienteId, setClienteId] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('usuario');
    const storedClienteId = sessionStorage.getItem('idcliente');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedClienteId) {
      setClienteId(storedClienteId);
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, clienteId, setClienteId }}>
      {children}
    </AppContext.Provider>
  );
};
