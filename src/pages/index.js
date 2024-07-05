import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function IndexPage() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('/login'); 
  }, [router]);

  return (
    <div>
      <Head>
        <title>Bienvenido a LaboraPE</title>
      </Head>
      <h1>Bienvenido a LaboraPE</h1>
      <p>Serás redirigido a la página de inicio de sesión en breve.</p>
    </div>
  );
}
