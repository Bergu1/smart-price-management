import React, { useEffect, useState } from 'react';
import { getProfile } from '../api';

const Home = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProfile(token);
      setUser(res.data);
    };
    fetchData();
  }, [token]);

  if (!user) return <p>Ładowanie...</p>;

  return (
    <div>
      {user.is_employee ? (
        <>
          <h2>Panel pracownika</h2>
          <p>Witaj, {user.name}!</p>
          <button onClick={() => window.location.href = '/dashboard'}>Przejdź tu</button>
        </>
      ) : (
        <>
          <h2>Witamy w naszym sklepie, {user.name}!</h2>
        </>
      )}
    </div>
  );
};

export default Home;
