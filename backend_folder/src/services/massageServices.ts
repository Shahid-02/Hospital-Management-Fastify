import { FastifyReply } from "fastify";
import { createMessageInput } from "../models/massage.schemas";
import prisma from "../config/prisma";

export const massageRegisterService = async (
  data: createMessageInput,
  reply: FastifyReply
) => {
  try {
    const massage = await prisma.message.create({
      data,
    });
    return massage;
  } catch (error) {
    reply.code(401).send({
      massage: "Massage Send Failed",
    });
  }
};

export const getAllMassageService = async () => {
  try {
    const massage = await prisma.message.findMany();
    return massage;
  } catch (error) {
    console.log(error);
  }
};
