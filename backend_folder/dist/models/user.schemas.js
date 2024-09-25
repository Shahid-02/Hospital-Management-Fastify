"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPatientSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// Define the schema
exports.createPatientSchema = zod_1.default.object({
    firstName: zod_1.default
        .string()
        .min(1, "First Name is required")
        .min(3, "First Name must contain at least 3 characters"),
    lastName: zod_1.default
        .string()
        .min(1, "Last Name is required")
        .min(3, "Last Name must contain at least 3 characters"),
    email: zod_1.default.string().email("Provide a valid Email").min(1, "Email is required"),
    phone: zod_1.default
        .string()
        .length(11, "Phone Number must contain exactly 11 digits")
        .min(1, "Phone is required"),
    nic: zod_1.default
        .string()
        .length(13, "NIC must contain exactly 13 digits")
        .min(1, "NIC is required"),
    dob: zod_1.default.string({ required_error: "DOB is required" }),
    gender: zod_1.default.enum(["Male", "Female"], { required_error: "Gender is required" }),
    // profileImageId: z.number().optional(),
    password: zod_1.default
        .string()
        .min(8, "Password must contain at least 8 characters")
        .min(1, "Password is required"),
});
// Define the schema for login
const loginPatientSchema = zod_1.default.object({
    email: zod_1.default.string().email("Provide a valid Email").min(1, "Email is required"),
    password: zod_1.default
        .string()
        .min(8, "Password must contain at least 8 characters")
        .min(1, "Password is required"),
    confirmPassword: zod_1.default.string(),
});
