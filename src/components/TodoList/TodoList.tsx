import { Todo } from '../../types/todo';
import { User } from '../../types/user';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  users: User[];
};

export const TodoList = ({ todos, users }: Props) => {
  return (
    <section className="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          user={
            users.find(user => user.id === todo.userId) || {
              id: 0,
              name: 'Unknown',
              username: 'Unknown',
              email: 'Unknown@example.com',
            }
          }
        />
      ))}
    </section>
  );
};
