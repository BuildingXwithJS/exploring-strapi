import Router from 'next/router';
import React, {useRef, useState} from 'react';

const endpoint = 'http://localhost:1337/auth/local';

export default () => {
  const loginRef = useRef();
  const pwdRef = useRef();
  const [error, setError] = useState('');

  const login = async () => {
    const identifier = loginRef.current.value;
    const password = pwdRef.current.value;

    try {
      const {jwt, user} = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
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
        <input type="text" placeholder="Username or email" ref={loginRef} />
        <input type="password" placeholder="Password" ref={pwdRef} />
        <button onClick={() => login()}>Login</button>
      </div>
      {error && <div style={{border: '1px red solid'}}>{error}</div>}
    </>
  );
};
