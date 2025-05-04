import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthPage.css'

const AuthPage = ({ setToken }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div>
      {isRegistering ? (
        <>
          <RegisterForm />
          <p class="check-if-account">
            Masz już konto?{' '}
            <button onClick={() => setIsRegistering(false)}>
              Zaloguj się
            </button>
          </p>
        </>
      ) : (
        <>
          <LoginForm setToken={setToken} />
          <p class="check-if-account">
            Nie masz konta?{' '}
            <button onClick={() => setIsRegistering(true)}>
              Zarejestruj się
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthPage;
