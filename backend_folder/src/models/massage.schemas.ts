import z from "zod";

// Zod schema for creating a message
const createMessageSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .min(3, "First Name must contain at least 3 characters")
    .max(255, "First Name can't be longer than 255 characters"),

  lastName: z
    .string()
    .min(1, "Last Name is required")
    .min(3, "Last Name must contain at least 3 characters")
    .max(255, "Last Name can't be longer than 255 characters"),

  email: z
    .string()
    .email("Provide a valid email address")
    .max(255, "Email can't be longer than 255 characters"),

  phone: z.string().length(11, "Phone number must be exactly 11 digits"),

  message: z
    .string()
    .min(1, "Message is required")
    .max(1000, "Message can't be longer than 1000 characters"),

  userId: z.number().optional(), // UserId is optional as it can be null
});

export type createMessageInput = z.infer<typeof createMessageSchema>;
