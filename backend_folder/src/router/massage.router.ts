import { FastifyInstance } from "fastify";
import {
  getAllMassageHandler,
  massageRegisterHandler,
} from "../controllers/massage.controllers";
export const massageRouter = (
  router: FastifyInstance,
  object: any,
  done: () => void
) => {
  router.post("/send", massageRegisterHandler);
  router.get("/getall", getAllMassageHandler);
  done();
};
export default massageRouter;
