const express = require('express');
const authRouter = require('./routes/authRouter');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const channelRouter = require('./routes/channelRouter');
const messageRouter = require('./routes/messageRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const userRouter = require('./routes/userRouter');

app.use(
  cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/channels', channelRouter);
app.use('/api/v1/messages', messageRouter);

app.get('/{*any}', (req, res, next) => {
  next(
    new AppError(`cant find any route for ${req.originalUrl} this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
