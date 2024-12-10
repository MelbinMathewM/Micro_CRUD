import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import verifyToken from "./middleware/userAuth.js";

dotenv.config();

const app = express();

// CORS setup
const allowedOrigins = [
  process.env.ALLOWED_ORIGINS,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by");

const userServiceGrpcUrl = process.env.USER_SERVICE_GRPC_URL;
const adminServiceHttpUrl = process.env.ADMIN_SERVICE_HTTP_URL;
const authServiceHttpUrl = process.env.AUTH_SERVICE_HTTP_URL;

// gRPC setup
const packageDefinition = protoLoader.loadSync("./src/protos/user.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).UserService;
const userService = new userProto(userServiceGrpcUrl, grpc.credentials.createInsecure());

// gRPC handler functions
const getUser = (req, res) => {
  const userId = req.user.userId;
  const token = req.user.token;
  userService.GetUser({ user_id: userId, token: token }, (error, response) => {
    if (error) {
      console.error("gRPC error:", error);
      res.status(500).send({ error: error.message });
    } else {
      res.json(response);
    }
  });
};


const editUser = (req, res) => {
  console.log(req.body)
  const userId = req.user.userId;
  const token = req.user.token;

  userService.EditUser({ user_id: userId, token: token, user : req.body }, (error, response) => {
    if (error) {
      res.status(500).send({ error: error.message });
    } else {
      res.json(response);
    }
  });
};

// Services configuration
const services = [
  {
    route: "/user",
    type: "grpc",
    role: "user",
    handlers: {
      "/user/home": getUser,
      "/user/update": editUser,
    },
  },
  {
    route: "/admin",
    target: adminServiceHttpUrl,
    role: "admin",
  },
  {
    route: "/auth",
    target: authServiceHttpUrl,
  },
];

// Setup routes and proxies
services.forEach((service) => {
  const middleware = service.role ? verifyToken(service.role) : (req, res, next) => next();

  if (service.type === "grpc") {
    app.use(service.route, express.json());
    Object.entries(service.handlers).forEach(([route, handler]) => {
      app.use(route, middleware, (req, res) => {
        handler(req, res);
      });
    });
  } else if (service.target) {
    app.use(
      service.route,
      middleware,
      createProxyMiddleware({
        target: service.target,
        changeOrigin: true,
        secure: false
      })
    );
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("API Gateway running...")
);
