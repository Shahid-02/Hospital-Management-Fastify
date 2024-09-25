import { FastifyReply, FastifyRequest } from "fastify";
import { createAppointmentInput } from "../models/appointment.schemas";
import {
  appointmentRegisterService,
  deleteAppointmentService,
  getAllAppointmentsService,
  updateAppointmentStatusService,
} from "../services/appointmentServices";

// Register  Appointments
export const appointmentRegisterHandler = async (
  request: FastifyRequest<{
    Body: createAppointmentInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;
    const appointment = await appointmentRegisterService(body, reply, request);

    reply.code(201).send({
      message: "Appointment Send!",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Update Appointments Status
export const updateAppointmentStatusHandel = async (
  request: FastifyRequest<{
    Params: {
      id: number;
    };
    Body: {
      status: "Accepted" | "Rejected";
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(request.params.id);
    const { status } = request.body;

    if (isNaN(id)) {
      return reply.code(400).send({ message: "Invalid appointment ID" });
    }

    const appointment = await updateAppointmentStatusService(
      id,
      status,
      reply,
      request
    );

    reply.code(200).send({
      message: "Appointment status updated!",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Delete Appointment

export const deleteAppointmentHandler = async (
  request: FastifyRequest<{
    Params: {
      id: number;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const id = Number(request.params.id);

    const deleteAppointment = await deleteAppointmentService(
      id,
      reply,
      request
    );

    reply.code(200).send({
      message: "Appointment deleted!",
      data: deleteAppointment,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

// Get All Appointment

export const getAllAppointmentHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const appointments = await getAllAppointmentsService(reply, request);

    reply.send({
      message: "All Appointments",
      data: {
        appointments,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};
