"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const createAppointmentSchema = zod_1.default.object({
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
        .min(11, "Phone Number must contain exactly 11 digits")
        .max(11, "Phone Number must contain exactly 11 digits")
        .min(1, "Phone is required"),
    nic: zod_1.default
        .string()
        .min(13, "NIC must contain exactly 13 digits")
        .max(13, "NIC must contain exactly 13 digits")
        .min(1, "NIC is required"),
    dob: zod_1.default.string({ required_error: "Date of Birth is required" }),
    gender: zod_1.default.enum(["Male", "Female"], { required_error: "Gender is required" }),
    appointmentDate: zod_1.default.string({
        required_error: "Appointment Date is required",
    }),
    department: zod_1.default.string().min(1, "Department is required"),
    doctor_firstName: zod_1.default
        .string()
        .min(1, "Doctor's First Name is required")
        .min(3, "Doctor's First Name must contain at least 3 characters"),
    doctor_lastName: zod_1.default
        .string()
        .min(1, "Doctor's Last Name is required")
        .min(3, "Doctor's Last Name must contain at least 3 characters"),
    hasVisited: zod_1.default.boolean().optional(), // Optional field for visit status
    address: zod_1.default
        .string()
        .min(1, "Address is required")
        .min(5, "Address must contain at least 5 characters"),
});
