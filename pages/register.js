import Router from 'next/router';
import React, {useRef, useState} from 'react';

const endpoint = 'http://localhost:1337/auth/local/register';

export default () => {
  const loginRef = useRef();
  const emailRef = useRef();
  const pwdRef = useRef();
  const [error, setError] = useState('');

  const register = async () => {
    const username = loginRef.current.value;
    const email = emailRef.current.value;
    const password = pwdRef.current.value;

    try {
      const {jwt, user} = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }).then(res => {
        if (res.status !== 200) {
          throw new Error('Error logging in, non 200 code');
        }
        return res.json();
      });

      window.sessionStorage.setItem('jwt', jwt);
      window.sessionStorage.setItem('user', JSON.stringify(user));

      Router.push('/');
    } catch (e) {
      setError(e.toString());
    }
  };

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'column', width: 300}}>
        <input type="text" placeholder="Login" ref={loginRef} />
        <input type="text" placeholder="Email" ref={emailRef} />
        <input type="password" placeholder="Password" ref={pwdRef} />
        <button onClick={() => register()}>Register</button>
      </div>
      {error && <div style={{border: '1px red solid'}}>{error}</div>}
    </>
  );
};
