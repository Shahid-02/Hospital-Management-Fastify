import { FastifyReply, FastifyRequest } from "fastify";
import { createMessageInput } from "../models/massage.schemas";
import {
  getAllMassageService,
  massageRegisterService,
} from "../services/massageServices";

export const massageRegisterHandler = async (
  request: FastifyRequest<{
    Body: createMessageInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const body = request.body;
    const message = await massageRegisterService(body, reply);
    reply.code(201).send({
      message: "Message Send!",
      data: message,
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};

export const getAllMassageHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const messages = await getAllMassageService();
    reply.send({
      message: "All Messages",
      data: {
        messages,
      },
    });
  } catch (error) {
    console.log(error);
    reply.code(500).send({ message: error });
  }
};
