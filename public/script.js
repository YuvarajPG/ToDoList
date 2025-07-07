const BASE_URL = 'https://todolist-zrno.onrender.com';

let token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');

// Register
async function register() {
  const username = prompt('Choose a username:');
  const password = prompt('Choose a password:');

  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert('✅ Registered! Now log in.');
  } else {
    alert('❌ Registration failed.');
  }
}

// Login
async function login() {
  const username = prompt('Username:');
  const password = prompt('Password:');

  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    token = data.token;
    userId = data.userId;
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    alert('✅ Login successful');
    loadTasks();
  } else {
    alert('❌ Login failed');
  }
}

// Load tasks
async function loadTasks() {
  if (!token) return;

  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  tasks.forEach(task => {
    const item = document.createElement('li');
    item.textContent = task.task;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await fetch(`${BASE_URL}/delete/${task._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadTasks();
    };

    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

// Add task
async function addTask() {
  const task = document.getElementById('taskInput').value;
  if (!task || !token) return;

  await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ task })
  });

  document.getElementById('taskInput').value = '';
  loadTasks();
}

// Auto-load tasks if logged in
window.onload = () => {
  if (token) loadTasks();
};
