import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prisma";
import { createPatientInput, loginPatientInput } from "../models/user.schemas";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { uploadOnCloudinary } from "../utils/cloudinary";

// Register Patient
export const patientRegisterService = async (
  data: createPatientInput,
  reply: FastifyReply
) => {
  try {
    const patientExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (patientExists) {
      return reply.code(401).send({
        message: "Email already exists",
      });
    }

    const { password, ...newUser } = data;
    const hashedPassword = await hashPassword(password);

    const patient = await prisma.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
        role: "Patient",
      },
    });

    return patient;
  } catch (error) {
    console.error(error);
  }
};

// login service
export const loginPatientService = async (
  data: loginPatientInput,
  reply: FastifyReply
) => {
  try {
    // find  patient
    const patient = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!patient) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }
    if (data.password !== data.confirmPassword) {
      return reply.code(400).send({
        massage: "Password & Confirm Password Do Not Match!",
      });
    }

    // compare password
    const isMatch = await comparePassword(data.password, patient.password);
    if (!isMatch) {
      return reply.code(401).send({ message: "Invalid email or password" });
    }
    // generate token
    const payload = {
      user: patient,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.EXPIRES_JWT as string,
    });

    const cookieName = patient.role === "Admin" ? "adminToken" : "patientToken";

    // Set the JWT token in a cookie
    reply.setCookie(cookieName, token, {
      // httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return {
      token,
      patient,
    };
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

//   Add New Admin  service
export const adminRegisterService = async (
  data: createPatientInput,
  reply: FastifyReply
) => {
  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (adminExists) {
      return reply.code(401).send({ message: "Email already exists" });
    }

    const { password, ...newUser } = data;
    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
        role: "Admin",
      },
    });

    return admin;
  } catch (error) {
    console.error(error);
  }
};

// Add New Doctor Service

export const doctorRegisterService = async (
  data: createPatientInput,
  reply: FastifyReply,
  request: FastifyRequest
) => {
  try {
    console.log("Received data:", data.email);

    const existingDoctor = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingDoctor) {
      reply.code(409).send({ message: "Email already exists" });
      return null;
    }

    const { password, ...newUser } = data;
    const hashedPassword = await hashPassword(password);

    const doctor = await prisma.user.create({
      data: {
        ...newUser,
        password: hashedPassword,
        role: "Doctor",
      },
    });

    const files = await request.saveRequestFiles();

    if (!files || files.length === 0) {
      reply.code(400).send({ message: "No file uploaded" });
      return null;
    }

    const file = files[0];
    const filePath = file.filepath;

    // Upload the file to Cloudinary
    const img = await uploadOnCloudinary(filePath);

    if (!img) {
      reply.code(500).send({ message: "Failed to upload image" });
      return null;
    }
    console.log(img, "Image uploaded successfully");

    return doctor;
  } catch (error) {
    console.error("Error in doctorRegisterService:", error);
    reply.code(500).send({ message: "Internal Server Error" });
    return null;
  }
};

// Get All The Doctor Services

export const getAllDoctorsService = async () => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: "Doctor" },
    });
    return doctors;
  } catch (error) {
    console.error(error);
  }
};

// Admin LogOut

export const adminLogoutService = async (reply: FastifyReply) => {
  try {
    // Set the JWT token in a cookie
    reply.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() - 1),
    });

    return { message: "Logged out successfully!" };
  } catch (error) {
    console.error(error);
    reply.code(500).send({ message: error });
  }
};

// Patient LogOut

export const patientLogoutService = async (reply: FastifyReply) => {
  try {
    // Set the JWT token in a cookie
    reply.clearCookie("patientToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(Date.now() - 1),
    });

    return { message: "Logged out successfully!" };
  } catch (error) {
    console.error(error);
    reply.code(500).send({ message: error });
  }
};

export const uploadImageService = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user as { user: { id: string | number } };

    // Access user.id from user.user
    const userId: number = Number(user.user?.id);

    // console.log(userId);

    const files = await request.saveRequestFiles();

    if (!files || files.length === 0) {
      return reply.code(400).send({ message: "No file uploaded" });
    }

    const file = files[0];
    const filePath = file.filepath;

    // Upload the file to Cloudinary
    const img = await uploadOnCloudinary(filePath);

    const response = await prisma.docImage.create({
      data: {
        publicId: img?.public_id as string,
        url: img?.url as string,
        userId: userId,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    reply.code(500).send({ message: error });
  }
};
