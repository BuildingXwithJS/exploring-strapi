import Router from 'next/router';
import React, {useEffect, useRef, useState} from 'react';

const endpoint = 'http://localhost:1337/todos';

export default () => {
  const titleRef = useRef();
  const jwtRef = useRef();
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${jwtRef.current}`,
      },
    }).then(r => r.json());
    setTodos(res);
  };

  useEffect(() => {
    const jwt = window.sessionStorage.getItem('jwt');
    if (!jwt) {
      Router.push('/login');
    }
    jwtRef.current = jwt;

    // fetch the list of todos
    getTodos();
  }, []);

  const createTodo = async () => {
    const title = titleRef.current.value;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtRef.current}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
      }),
    }).then(r => r.json());

    const newTodos = [...todos, res];
    setTodos(newTodos);
  };

  const toggleTodo = async (todo, checked) => {
    const res = await fetch(`${endpoint}/${todo.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${jwtRef.current}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        done: checked,
      }),
    }).then(r => r.json());

    const newTodos = todos.map(t => {
      if (t.id === todo.id) {
        return res;
      }
      return t;
    });
    setTodos(newTodos);
  };

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', width: 200}}>
        <input type="text" placeholder="Title" ref={titleRef} />
        <button onClick={() => createTodo()}>Create todo</button>
      </div>

      <div>
        <h2>Todos list:</h2>
        {todos.map(todo => (
          <div key={todo.title} style={{display: 'flex', alignItems: 'center'}}>
            <input type="checkbox" checked={todo.done} onChange={e => toggleTodo(todo, e.target.checked)} />
            {todo.title}
          </div>
        ))}
      </div>
    </div>
  );
};
