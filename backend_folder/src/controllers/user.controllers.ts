import { FastifyReply, FastifyRequest } from "fastify";
import {
  adminLogoutService,
  adminRegisterService,
  doctorRegisterService,
  getAllDoctorsService,
  loginPatientService,
  patientLogoutService,
  patientRegisterService,
  uploadImageService,
} from "../services/userServices";
import { createPatientInput, loginPatientInput } from "../models/user.schemas";

// Register Patient
export const patientRegisterHandler = async (
  request: FastifyRequest<{
    Body: createPatientInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;

    const patient = await patientRegisterService(body, reply);

    reply.code(201).send({
      message: "User Registered!",
      data: {
        patient,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// login Patient and Admin
export const patientLoginHandler = async (
  request: FastifyRequest<{
    Body: loginPatientInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;
    const patient = await loginPatientService(body, reply);

    reply.send({
      message: "Login Successfully!",
      data: patient,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Register  Admin
export const adminRegisterHandler = async (
  request: FastifyRequest<{
    Body: createPatientInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;

    const admin = await adminRegisterService(body, reply);

    reply.send({
      message: "New Admin Registered!",
      data: {
        admin,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Register Docter
export const docterRegisterHandler = async (
  request: FastifyRequest<{ Body: createPatientInput }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;

    const docter = await doctorRegisterService(body, reply, request);

    reply.code(201).send({
      message: "New Doctor Registered!",
      data: docter,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Get All The Doctor

export const getAllDoctorsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const doctors = await getAllDoctorsService();

    reply.send({
      message: "All Doctors",
      data: {
        doctors,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};
// Admin  logOut
export const adminLogoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const logOutAdmin = await adminLogoutService(reply);

    reply.code(200).send({
      message: "Admin Logged Out Successfully.",
      data: logOutAdmin,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};
// Patient logOut
export const patientLogoutHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const logOutPatient = await patientLogoutService(reply);

    reply.code(200).send({
      message: "Patient Logged Out Successfully.",
      data: logOutPatient,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Patient Details
export const getUserDetailsHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = request.user;

    reply.send({
      message: "User Details",
      data: user,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({
      message: error,
    });
  }
};

export const uploadImageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const upload = await uploadImageService(request, reply);

    // Respond with success
    return reply.code(201).send({
      message: "File uploaded successfully",
      data: upload,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    reply.code(500).send({ message: "Failed to upload image" });
  }
};
