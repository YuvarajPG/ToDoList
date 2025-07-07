require('dotenv').config();


const express = require('express');
const app = express();
const path = require('path');

let tasks = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/add', (req, res) => {
  tasks.push(req.body.task);
  res.sendStatus(200);
});

app.delete('/delete/:id', (req, res) => {
  tasks.splice(req.params.id, 1);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

