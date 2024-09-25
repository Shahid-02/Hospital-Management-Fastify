import z from "zod";

// Define the schema
export const createPatientSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .min(3, "First Name must contain at least 3 characters"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .min(3, "Last Name must contain at least 3 characters"),
  email: z.string().email("Provide a valid Email").min(1, "Email is required"),
  phone: z
    .string()
    .length(11, "Phone Number must contain exactly 11 digits")
    .min(1, "Phone is required"),
  nic: z
    .string()
    .length(13, "NIC must contain exactly 13 digits")
    .min(1, "NIC is required"),
  dob: z.string({ required_error: "DOB is required" }),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  // profileImageId: z.number().optional(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .min(1, "Password is required"),
});

// Infer the type from the schema
export type createPatientInput = z.infer<typeof createPatientSchema>;

// Define the schema for login
const loginPatientSchema = z.object({
  email: z.string().email("Provide a valid Email").min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .min(1, "Password is required"),
  confirmPassword: z.string(),
});

export type loginPatientInput = z.infer<typeof loginPatientSchema>;
