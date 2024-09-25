import { FastifyInstance } from "fastify";
import {
  adminLogoutHandler,
  adminRegisterHandler,
  docterRegisterHandler,
  getAllDoctorsHandler,
  getUserDetailsHandler,
  patientLoginHandler,
  patientLogoutHandler,
  patientRegisterHandler,
  uploadImageHandler,
} from "../controllers/user.controllers";
import { createPatientInput } from "../models/user.schemas";

export const userRouter = (
  router: FastifyInstance,
  object: any,
  done: () => void
) => {
  router.post("/patient/register", patientRegisterHandler);
  router.post("/login", patientLoginHandler);
  router.post("/admin/addnew", adminRegisterHandler);
  router.post<{ Body: createPatientInput }>(
    "/doctor/addnew",
    async (req, reply) => {
      return docterRegisterHandler(req, reply);
    }
  );
  router.get("/doctors", getAllDoctorsHandler);
  router.get("/patient/logout", patientLogoutHandler);
  router.get("/admin/logout", adminLogoutHandler);
  router.get("/patient/me", getUserDetailsHandler);
  router.get("/admin/me", getUserDetailsHandler);
  router.post("/upload", async (req, reply) => uploadImageHandler(req, reply));
  done();
};
