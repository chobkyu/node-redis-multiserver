require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");

const app = express();
const redisPub = new Redis({
  // Publisher 용 Redis
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});
const redisSub = new Redis({
  // Subscriber 용 Redis
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const CHANNEL_NAME = "chat";
const SERVER_NAME = process.env.SERVER_NAME || "Unknown";

app.use(express.json());

// 메시지 발행 (Publisher)
app.post("/publish", (req, res) => {
  const { user, text } = req.body;
  const message = { server: SERVER_NAME, user, text, timestamp: new Date() };

  redisPub.publish(CHANNEL_NAME, JSON.stringify(message)); // 🔥 redisPub 사용!
  console.log(`[${SERVER_NAME}] Published:`, message);

  res.json({ status: "Message sent", message });
});

// 메시지 수신 (Subscriber)
redisSub.subscribe(CHANNEL_NAME, (err, count) => {
  if (err) {
    console.error("Subscription failed:", err);
  } else {
    console.log(`[${SERVER_NAME}] Subscribed to ${count} channel(s).`);
  }
});

redisSub.on("message", (channel, message) => {
  const parsedMessage = JSON.parse(message);

  // 자신이 보낸 메시지는 무시 (서버 이름 비교)
  if (parsedMessage.server === SERVER_NAME) return;

  console.log(`[${SERVER_NAME}] Received from ${channel}:`, parsedMessage);
});

// 서버 실행
app.listen(3000, () => {
  console.log(`[${SERVER_NAME}] Server running on port 3000`);
});
