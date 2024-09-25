import dotenv from "dotenv";
import Fastify, { FastifyRequest } from "fastify";
import { userRouter } from "./router/user.router";
import fastifyJWT from "@fastify/jwt";
import { appointmentRouter } from "./router/appointment.router";
import authenticationUser from "./middlerware/authentication.middlerware";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import massageRouter from "./router/massage.router";
import fastifyMultipart from "@fastify/multipart";
import fastifyRateLimit from "@fastify/rate-limit";
// import caching from "@fastify/caching";
// import IORedis from "ioredis";
// import redisClient from "@fastify/redis";

// const redis = new IORedis({ host: "127.0.0.1" });

// const abcache = require("abstract-cache")({
//   useAwait: false,
//   driver: {
//     name: "abstract-cache-redis",
//     options: { client: redis },
//   },
// });
// config Dotenv
dotenv.config();

// fastify service configuration
const server = Fastify({ logger: true });

// Register fastify-multipart to handle multipart/form-data
server
  .register(fastifyMultipart, {
    attachFieldsToBody: true,
  })

  // config Core
  .register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
  // configuration Jwt Token
  .register(fastifyJWT, {
    secret: process.env.JWT_SECRET as string,
  })
  // add middleware to validate JWT token
  .addHook("onRequest", authenticationUser)
  // cookies configuration
  .register(fastifyCookie, {
    secret: process.env.JWT_SECRET,
    parseOptions: {},
  })
  // rate limit configuration
  .register(fastifyRateLimit, {
    max: 20,
    timeWindow: "1 minute",
    keyGenerator: function (request: FastifyRequest) {
      if (
        request.user &&
        typeof request.user === "object" &&
        "id" in request.user
      ) {
        return (request.user as { id: string | number }).id.toString();
      }
      return request.ip;
    },
    errorResponseBuilder: function (req, context) {
      return {
        statusCode: 429,
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again in 1 minute.",
      };
    },
    ban: 1,
  });
// caching config
// .register(redisClient, { client: redis })
// .register(caching, { cache: abcache });

// connect to fastify server
const main = async () => {
  try {
    // register routes
    server.register(userRouter, { prefix: "/api/v1/user" });
    server.register(appointmentRouter, { prefix: "/api/v1/appointment" });
    server.register(massageRouter, { prefix: "/api/v1/message" });
    server.listen({ port: 4000, host: "0.0.0.0" });
    console.log("Server is running on http://localhost:4000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
