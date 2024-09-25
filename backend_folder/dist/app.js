"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_1 = __importDefault(require("fastify"));
const user_router_1 = require("./router/user.router");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const appointment_router_1 = require("./router/appointment.router");
const cookie_1 = __importDefault(require("@fastify/cookie"));
const cors_1 = __importDefault(require("@fastify/cors"));
const massage_router_1 = __importDefault(require("./router/massage.router"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const authentication_middlerware_1 = __importDefault(require("./middlerware/authentication.middlerware"));
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
dotenv_1.default.config();
// fastify service configuration
const server = (0, fastify_1.default)({ logger: true });
// Register fastify-multipart to handle multipart/form-data
server
    .register(multipart_1.default, {
    attachFieldsToBody: true,
})
    // config Core
    .register(cors_1.default, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
})
    // configuration Jwt Token
    .register(jwt_1.default, {
    secret: process.env.JWT_SECRET,
})
    // add middleware to validate JWT token
    .addHook("onRequest", authentication_middlerware_1.default)
    // cookies configuration
    .register(cookie_1.default, {
    secret: process.env.JWT_SECRET,
    parseOptions: {},
})
    // rate limit configuration
    .register(rate_limit_1.default, {
    max: 20,
    timeWindow: "1 minute",
    keyGenerator: function (request) {
        if (request.user &&
            typeof request.user === "object" &&
            "id" in request.user) {
            return request.user.id.toString();
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
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // register routes
        server.register(user_router_1.userRouter, { prefix: "/api/v1/user" });
        server.register(appointment_router_1.appointmentRouter, { prefix: "/api/v1/appointment" });
        server.register(massage_router_1.default, { prefix: "/api/v1/message" });
        server.listen({ port: 4000, host: "0.0.0.0" });
        console.log("Server is running on http://localhost:4000");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
main();
