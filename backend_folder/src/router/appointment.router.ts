import { FastifyInstance } from "fastify";
import {
  appointmentRegisterHandler,
  deleteAppointmentHandler,
  getAllAppointmentHandler,
  updateAppointmentStatusHandel,
} from "../controllers/appointment.controllers";

export const appointmentRouter = (
  router: FastifyInstance,
  object: any,
  done: () => void
) => {
  router.post("/post", appointmentRegisterHandler);
  router.put("/update/:id", updateAppointmentStatusHandel);
  router.delete("/delete/:id", deleteAppointmentHandler);
  router.get("/getall", getAllAppointmentHandler);

  done();
};
