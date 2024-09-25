"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAppointmentHandler = exports.deleteAppointmentHandler = exports.updateAppointmentStatusHandel = exports.appointmentRegisterHandler = void 0;
const appointmentServices_1 = require("../services/appointmentServices");
// Register  Appointments
const appointmentRegisterHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const appointment = yield (0, appointmentServices_1.appointmentRegisterService)(body, reply, request);
        reply.code(201).send({
            message: "Appointment Send!",
            data: appointment,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.appointmentRegisterHandler = appointmentRegisterHandler;
// Update Appointments Status
const updateAppointmentStatusHandel = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(request.params.id);
        const { status } = request.body;
        if (isNaN(id)) {
            return reply.code(400).send({ message: "Invalid appointment ID" });
        }
        const appointment = yield (0, appointmentServices_1.updateAppointmentStatusService)(id, status, reply, request);
        reply.code(200).send({
            message: "Appointment status updated!",
            data: appointment,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.updateAppointmentStatusHandel = updateAppointmentStatusHandel;
// Delete Appointment
const deleteAppointmentHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(request.params.id);
        const deleteAppointment = yield (0, appointmentServices_1.deleteAppointmentService)(id, reply, request);
        reply.code(200).send({
            message: "Appointment deleted!",
            data: deleteAppointment,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.deleteAppointmentHandler = deleteAppointmentHandler;
// Get All Appointment
const getAllAppointmentHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointments = yield (0, appointmentServices_1.getAllAppointmentsService)(reply, request);
        reply.send({
            message: "All Appointments",
            data: {
                appointments,
            },
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.getAllAppointmentHandler = getAllAppointmentHandler;
