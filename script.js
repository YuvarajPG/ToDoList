let token = localStorage.getItem('token');
let userId = localStorage.getItem('userId');

// Register
async function register() {
  const username = prompt('Choose a username:');
  const password = prompt('Choose a password:');

  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert('Registration successful. Now login.');
  } else {
    alert('Registration failed.');
  }
}

// Login
async function login() {
  const username = prompt('Enter username:');
  const password = prompt('Enter password:');

  const res = await fetch('/login', {
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
    loadTasks();
    alert('Login successful');
  } else {
    alert('Login failed');
  }
}

// Load tasks (requires token)
async function loadTasks() {
  if (!token) return;

  const res = await fetch('/tasks', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
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
      await fetch(`/delete/${task._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      loadTasks();
    };

    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

// Add task (requires token)
async function addTask() {
  const task = document.getElementById('taskInput').value;
  if (!task || !token) return;

  await fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ task })
  });

  document.getElementById('taskInput').value = '';
  loadTasks();
}

// Auto-load if logged in
window.onload = () => {
  if (token) loadTasks();
};
