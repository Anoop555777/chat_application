const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const { initSocket } = require('./socket');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, err);
  console.log('Uncaught Exception! Shutting down... 💥');
  process.exit(1);
});
const app = require('./app');

const server = http.createServer(app);

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
  });

const PORT = process.env.PORT || 8000;

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection! Shutting down... 💥');
  server.close(() => {
    process.exit(1);
  });
});
