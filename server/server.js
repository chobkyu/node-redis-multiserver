require("dotenv").config();
const express = require("express");
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const {createAdapter} = require('socket.io-redis');
const Redis = require('ioredis');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // 모든 도메인 허용
  }
});

app.use(express.static(path.join(__dirname,'public')));

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const pubClient = new Redis(redisPort, redisHost);
const subClient = new Redis(redisPort, redisHost);

io.adapter(createAdapter({pubClient, subClient}));

require('./socket')(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});


