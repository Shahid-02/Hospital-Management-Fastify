import z from "zod";

const createAppointmentSchema = z.object({
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
    .min(11, "Phone Number must contain exactly 11 digits")
    .max(11, "Phone Number must contain exactly 11 digits")
    .min(1, "Phone is required"),
  nic: z
    .string()
    .min(13, "NIC must contain exactly 13 digits")
    .max(13, "NIC must contain exactly 13 digits")
    .min(1, "NIC is required"),
  dob: z.string({ required_error: "Date of Birth is required" }),
  gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
  appointmentDate: z.string({
    required_error: "Appointment Date is required",
  }),
  department: z.string().min(1, "Department is required"),
  doctor_firstName: z
    .string()
    .min(1, "Doctor's First Name is required")
    .min(3, "Doctor's First Name must contain at least 3 characters"),
  doctor_lastName: z
    .string()
    .min(1, "Doctor's Last Name is required")
    .min(3, "Doctor's Last Name must contain at least 3 characters"),
  hasVisited: z.boolean().optional(), // Optional field for visit status
  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Address must contain at least 5 characters"),
});

export type createAppointmentInput = z.infer<typeof createAppointmentSchema>;
