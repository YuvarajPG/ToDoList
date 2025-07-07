async function addTask() {
  const task = document.getElementById('taskInput').value;
  if (!task) return;

  await fetch('/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task })
  });

  document.getElementById('taskInput').value = '';
  loadTasks();
}

async function loadTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();

  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    const item = document.createElement('li');
    item.textContent = task;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await fetch(`/delete/${index}`, { method: 'DELETE' });
      loadTasks();
    };
    item.appendChild(delBtn);
    list.appendChild(item);
  });
}

loadTasks();
