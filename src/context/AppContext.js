import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem('usuario')) || null;
    }
    return null;
  });

  const [clienteId, setClienteId] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem('clienteId') || null;
    }
    return null;
  });

  const [freelancerId, setFreelancerId] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem('freelancerId') || null;
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem('usuario', JSON.stringify(user));
      sessionStorage.setItem('clienteId', clienteId);
      sessionStorage.setItem('freelancerId', freelancerId);
    }
  }, [user, clienteId, freelancerId]);

  return (
    <AppContext.Provider value={{ user, setUser, clienteId, setClienteId, freelancerId, setFreelancerId }}>
      {children}
    </AppContext.Provider>
  );
};
