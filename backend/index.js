const dotenv = require("dotenv");
dotenv.config();
require("./db");
const express = require("express");
const session = require("express-session");
const http = require("http");
const socketIo = require("socket.io");
const ExpressRateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const { updateCoinPrices } = require("./utils/price");
require("./utils/subscriptions");

const User = require("./models/User");
const Room = require("./models/Room");
const Fee = require("./models/Fee");

const getFee = async () => {
  try {
    const fee = await Fee.findOne({});

    if (!fee) {
      const newFee = new Fee({
        total: 0,
      });

      await newFee.save();
    }

    return fee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

getFee();

const originList = [process.env.CLIENT_URL];
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: originList || "http://127.0.0.1:3000",
    credentials: true,
  },
});

// Rate limit configuration
const rateLimiter = ExpressRateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit each IP to 60 requests per minute
});

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

app.set("trust proxy", 1);

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: "FriendFlowTech",
  store: store,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: true, // Restrict access to cookies via JavaScript
    sameSite: "strict", // Protect against CSRF attacks
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Set the expiration time here
  },
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(sessionMiddleware);

// Middleware to add io instance to req object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware setup
app.use(
  cors({
    origin: originList,
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(ExpressMongoSanitize());
app.use(cookieParser());
app.use(express.json());

// Route Middlewares
app.use("/api/auth", rateLimiter, require("./routes/auth"));
app.use("/api/user", rateLimiter, require("./routes/user"));
app.use("/api/room", rateLimiter, require("./routes/room"));
app.use("/api/coin", rateLimiter, require("./routes/coin"));
app.use("/api/wallet", rateLimiter, require("./routes/wallet"));
app.use("/api/key", rateLimiter, require("./routes/key"));
app.use("/api/message", rateLimiter, require("./routes/message"));
app.use("/api/trade", rateLimiter, require("./routes/trade"));
app.use("/api/transaction", rateLimiter, require("./routes/transaction"));

// Redirect http to https and remove www from URL (for production)
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    // Redirect http to https
    if (req.header("x-forwarded-proto") !== "https") {
      return res.redirect(`https://${req.header("host")}${req.url}`);
    }

    // Replace www with non-www
    if (req.header("host")?.startsWith("www.")) {
      return res.redirect(
        301,
        `https://${req.header("host")?.replace("www.", "")}${req.url}`
      );
    }

    next();
  });
}

// Point the server to the build folder of the app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const getUser = async (userID) => {
  try {
    const user = await User.getUser(userID);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// WebSocket routing
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);
  // console.log("Number of connections:", io.engine.clientsCount);

  socket.on("join_room", (room_id) => {
    getUser(socket.request.session.user).then(async (user) => {
      if (!user) {
        return socket.disconnect();
      }

      const isUserInRoom = await Room.exists({
        _id: room_id,
        users: { $in: [user._id] },
      });

      if (!isUserInRoom) {
        return socket.disconnect();
      }

      // console.log("user from socket:", user._id);
      // console.log("A user joined room:", room_id);
      socket.join(room_id);
    });
  });

  socket.on("disconnect", () => {
    // console.log("A user disconnected");
  });
});

updateCoinPrices();

// Update coin prices every 5 minutes
setInterval(() => {
  updateCoinPrices();
}, 5 * 60 * 1000);

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
