"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
// Zod schema for creating a message
const createMessageSchema = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .min(1, "First Name is required")
        .min(3, "First Name must contain at least 3 characters")
        .max(255, "First Name can't be longer than 255 characters"),
    lastName: zod_1.default
        .string()
        .min(1, "Last Name is required")
        .min(3, "Last Name must contain at least 3 characters")
        .max(255, "Last Name can't be longer than 255 characters"),
    email: zod_1.default
        .string()
        .email("Provide a valid email address")
        .max(255, "Email can't be longer than 255 characters"),
    phone: zod_1.default.string().length(11, "Phone number must be exactly 11 digits"),
    message: zod_1.default
        .string()
        .min(1, "Message is required")
        .max(1000, "Message can't be longer than 1000 characters"),
    userId: zod_1.default.number().optional(), // UserId is optional as it can be null
});
