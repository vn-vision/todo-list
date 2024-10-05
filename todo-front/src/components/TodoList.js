import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Checkbox, List, ListItem, TextField, Typography } from '@mui/material';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:5000/api/todos');
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    const response = await axios.post('http://localhost:5000/api/todos', { title: newTodo });
    setTodos([response.data, ...todos]);
    setNewTodo('');
  };

  const toggleComplete = async (id, completed) => {
    await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed });
    fetchTodos(); // Re-fetch to update the UI
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos(); // Re-fetch to update the UI
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        ToDo List
      </Typography>

      <TextField
        label="New Todo"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={addTodo} style={{ marginTop: '10px' }}>
        Add Todo
      </Button>

      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id, todo.completed)}
            />
            <Typography
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                flexGrow: 1,
              }}
            >
              {todo.title}
            </Typography>
            <Button color="secondary" onClick={() => deleteTodo(todo.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoList;