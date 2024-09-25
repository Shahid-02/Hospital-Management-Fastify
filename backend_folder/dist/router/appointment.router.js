"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const appointment_controllers_1 = require("../controllers/appointment.controllers");
const appointmentRouter = (router, object, done) => {
    router.post("/post", appointment_controllers_1.appointmentRegisterHandler);
    router.put("/update/:id", appointment_controllers_1.updateAppointmentStatusHandel);
    router.delete("/delete/:id", appointment_controllers_1.deleteAppointmentHandler);
    router.get("/getall", appointment_controllers_1.getAllAppointmentHandler);
    done();
};
exports.appointmentRouter = appointmentRouter;
