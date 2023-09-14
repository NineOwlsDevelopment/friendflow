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
  max: 60, // limit each IP to 60 requests per minute
});

// Middleware setup
app.use(
  cors({
    origin: originList,
    credentials: true,
  })
);
app.use(
  session({
    secret: "KwLUfC8heLPzeG1iFRQmtNiYeMLoP3AG5CNVXFPH1CfVD83oPQZB",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 5 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
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

const users = {}; // or use a Map if you prefer

// WebSocket routing
io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("message", (message) => {
    console.log(socket.handshake.headers);
    // socket.broadcast.emit("message", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
