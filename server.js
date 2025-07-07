require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ Mongo error:', err));

// ✅ Schemas
const taskSchema = new mongoose.Schema({
    userId: String,
    task: String
});
const Task = mongoose.model('Task', taskSchema);

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// ✅ Auth middleware
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.userId = decoded.id;
        next();
    });
}

// ✅ Register
app.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, password: hash });
    res.sendStatus(200);
});

// ✅ Login
app.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).send('User not found');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.json({ token, userId: user._id });
});

// ✅ Get tasks
app.get('/tasks', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// ✅ Add task
app.post('/add', authMiddleware, async (req, res) => {
    await Task.create({ userId: req.userId, task: req.body.task });
  res.sendStatus(200);
});

// ✅ Delete task
app.delete('/delete/:id', authMiddleware, async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.sendStatus(200);
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
