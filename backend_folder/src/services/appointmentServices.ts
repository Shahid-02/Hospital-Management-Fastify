import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../config/prisma";
import { createAppointmentInput } from "../models/appointment.schemas";
import redisClient from "@fastify/caching";

export const appointmentRegisterService = async (
  data: createAppointmentInput,
  reply: FastifyReply,
  request: FastifyRequest
) => {
  try {
    const user = request.user as { user: { id: string | number } };

    // Access user.id from user.user
    const patientId: number = Number(user.user?.id);

    if (isNaN(patientId)) {
      return reply.code(400).send({ message: "Invalid patient ID" });
    }

    const doctorFind = await prisma.user.findMany({
      where: {
        firstName: data.doctor_firstName,
        lastName: data.doctor_lastName,
        role: "Doctor",
        doctorDepartment: data.department,
      },
    });

    if (!doctorFind || doctorFind.length === 0) {
      return reply.code(404).send({ message: "Doctor not found" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        nic: data.nic,
        dob: data.dob,
        gender: data.gender,
        appointmentDate: data.appointmentDate,
        department: data.department,
        doctorFirstName: doctorFind[0].firstName,
        doctorLastName: doctorFind[0].lastName,
        address: data.address,
        hasVisited: false,
        doctorId: doctorFind[0].id,
        patient: { connect: { id: patientId } },
      },
    });

    return reply.code(201).send({
      success: true,
      message: "Appointment successfully created",
      appointment,
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ message: error });
  }
};

// Update Appointments Status
export const updateAppointmentStatusService = async (
  id: number,
  status: "Accepted" | "Rejected",
  reply: FastifyReply,
  request: FastifyRequest
) => {
  try {
    const user = request.user as { user?: { role: string } } | undefined;

    if (!user || !user.user || !user.user.role) {
      return reply.code(403).send({
        message:
          "You are not authorized to perform this action. No role found.",
      });
    }

    // Check if the user is an admin
    if (user.user.role !== "Admin") {
      return reply.code(403).send({
        message:
          "You are not authorized to perform this action. Admin access required.",
      });
    }
    // Find the appointment by id
    const appointment = await prisma.appointment.findFirst({
      where: { id },
    });

    if (!appointment) {
      return reply.code(404).send({ message: "Appointment not found" });
    }

    // Update the status of the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: status,
      },
    });

    return updatedAppointment;
  } catch (error) {
    console.error(error);
    throw new Error("Error updating appointment status");
  }
};

// Delete Appointment

export const deleteAppointmentService = async (
  id: number,
  reply: FastifyReply,
  request: FastifyRequest
) => {
  try {
    const user = request.user as { id: string; role: string };

    // Check if the user is an admin
    if (user.role !== "admin") {
      return reply.code(403).send({
        message:
          "You are not authorized to perform this action. Admin access required.",
      });
    }

    // Find the appointment by id
    const appointment = await prisma.appointment.findFirst({
      where: { id },
    });

    if (!appointment) {
      return reply.code(404).send({
        message: "Appointment not found",
      });
    }
    // delete appointment
    const deleteAppointment = await prisma.appointment.delete({
      where: { id },
    });

    return deleteAppointment;
  } catch (error) {
    console.error(error);

    return reply.code(500).send({
      message: "Internal Server Error",
    });
  }
};

// Get All Appointments

export const getAllAppointmentsService = async (
  reply: FastifyReply,
  request: FastifyRequest
) => {
  try {
    const user = request.user as { user?: { role: string } } | undefined;

    if (!user || !user.user || !user.user.role) {
      return reply.code(403).send({
        message:
          "You are not authorized to perform this action. No role found.",
      });
    }

    // Check if the user is an admin
    if (user.user.role !== "Admin") {
      return reply.code(403).send({
        message:
          "You are not authorized to perform this action. Admin access required.",
      });
    }

    const appointments = await prisma.appointment.findMany();

    return reply.code(200).send({
      message: "All appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    return reply.code(500).send({
      message: error,
    });
  }
};
