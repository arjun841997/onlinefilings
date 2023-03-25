require('dotenv').config() //Dot.ENV Config for databse name.

const express = require('express'); 
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const tasksRouter = require('./routes/tasks'); // Tasks Router
const projectsRouter = require('./routes/projects'); // Projects Router
const aggregationRouter = require('./routes/aggregation'); // Aggregation Router

const app = express();

app.use(logger('dev')); // Using for logging the APIs
app.use(express.json()); // Express Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/tasks', tasksRouter);
app.use('/api/v1/projects', projectsRouter);
app.use('/api/v1/aggregation', aggregationRouter);

module.exports = app;
