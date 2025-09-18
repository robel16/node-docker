const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
const cors = require("cors")
const RedisStore = require("connect-redis").RedisStore; // <-- import RedisStore class

const PostRouter = require("./routes/postRoute");
const UserRouter = require("./routes/userRoute");

const app = express();

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_IP,
  REDIS_SESSION,
  REDIS_URL,
  REDIS_PORT,
} = require("./config/config");

const PORT = process.env.PORT || 5000;
// Redis client
let redisClient = redis.createClient({
  socket: { host: REDIS_URL, port: REDIS_PORT },
});
redisClient.connect().then(()=>{
    console.log("connected to redis")
}).catch(console.error);

// MongoDB
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("connected to db");
    })
    .catch((e) => {
      console.log("error", e);
      setTimeout(connectWithRetry, 5000);
    });
};
app.enable("trust proxy")
connectWithRetry();

app.use(cors({}))
// Sessions with Redis
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: REDIS_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 300000,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.viewCount) {
    req.session.viewCount = 1;
    console.log("🆕 New session created:", req.sessionID);
  } else {
    req.session.viewCount++;
    console.log("📌 Existing session:", req.sessionID, "Views:", req.session.viewCount);
  }
  next();
});

app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h2> Hi there</h2>");
  console.log(" its working fine");
});

app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/users", UserRouter);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
