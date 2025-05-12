import './App.scss';

import { useState } from 'react';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

import { TodoList } from './components/TodoList';

import { User } from './types/user';

export const App = () => {
  const [title, setTitle] = useState('');
  const [hasTitleError, setHasTitleError] = useState(false);

  const [choose, setChoose] = useState('0');
  const [hasChooseError, setHasChooseError] = useState(false);

  function getUserById(userId: number): User | null {
    return usersFromServer.find(user => user.id === userId) || null;
  }

  const [todoList, setTodoList] = useState(
    todosFromServer.map(post => ({
      ...post,
      user: getUserById(post.userId),
    })),
  );

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const handleChooseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChoose(event.target.value);
    setHasChooseError(false);
  };

  let highestTodoId = todoList.reduce((highId, currentTodo) => {
    if (highId >= currentTodo.id) {
      return highId;
    } else {
      return currentTodo.id;
    }
  }, 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let hasAnyError = false;

    if (!title) {
      setHasTitleError(true);
      hasAnyError = true;
    }

    if (!+choose) {
      setHasChooseError(true);
      hasAnyError = true;
    }

    if (hasAnyError) {
      return;
    }

    highestTodoId += 1;

    setTodoList([
      ...todoList,
      {
        id: highestTodoId,
        title: title,
        userId: +choose,
        completed: false,
        user: getUserById(+choose),
      },
    ]);
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form action="/api/todos" method="POST" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="titleInput">Title name</label>
          <input
            id="titleInput"
            type="text"
            data-cy="titleInput"
            placeholder="Title name"
            value={title}
            onChange={handleTitleChange}
          />
          {hasTitleError && <span className="error">Please enter a title</span>}
        </div>

        <div className="field">
          <label htmlFor="titleInput">Choose a user</label>
          <select
            data-cy="userSelect"
            defaultValue={0}
            onChange={handleChooseChange}
          >
            <option value="0" disabled>
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </select>

          {hasChooseError && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={todoList} />
    </div>
  );
};
