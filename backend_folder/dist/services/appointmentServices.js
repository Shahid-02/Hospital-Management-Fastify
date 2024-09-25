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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAppointmentsService = exports.deleteAppointmentService = exports.updateAppointmentStatusService = exports.appointmentRegisterService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const appointmentRegisterService = (data, reply, request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        // Access user.id from user.user
        const patientId = Number((_a = user.user) === null || _a === void 0 ? void 0 : _a.id);
        if (isNaN(patientId)) {
            return reply.code(400).send({ message: "Invalid patient ID" });
        }
        const doctorFind = yield prisma_1.default.user.findMany({
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
        const appointment = yield prisma_1.default.appointment.create({
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
    }
    catch (error) {
        console.error(error);
        return reply.code(500).send({ message: error });
    }
});
exports.appointmentRegisterService = appointmentRegisterService;
// Update Appointments Status
const updateAppointmentStatusService = (id, status, reply, request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if (!user || !user.user || !user.user.role) {
            return reply.code(403).send({
                message: "You are not authorized to perform this action. No role found.",
            });
        }
        // Check if the user is an admin
        if (user.user.role !== "Admin") {
            return reply.code(403).send({
                message: "You are not authorized to perform this action. Admin access required.",
            });
        }
        // Find the appointment by id
        const appointment = yield prisma_1.default.appointment.findFirst({
            where: { id },
        });
        if (!appointment) {
            return reply.code(404).send({ message: "Appointment not found" });
        }
        // Update the status of the appointment
        const updatedAppointment = yield prisma_1.default.appointment.update({
            where: { id },
            data: {
                status: status,
            },
        });
        return updatedAppointment;
    }
    catch (error) {
        console.error(error);
        throw new Error("Error updating appointment status");
    }
});
exports.updateAppointmentStatusService = updateAppointmentStatusService;
// Delete Appointment
const deleteAppointmentService = (id, reply, request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        // Check if the user is an admin
        if (user.role !== "admin") {
            return reply.code(403).send({
                message: "You are not authorized to perform this action. Admin access required.",
            });
        }
        // Find the appointment by id
        const appointment = yield prisma_1.default.appointment.findFirst({
            where: { id },
        });
        if (!appointment) {
            return reply.code(404).send({
                message: "Appointment not found",
            });
        }
        // delete appointment
        const deleteAppointment = yield prisma_1.default.appointment.delete({
            where: { id },
        });
        return deleteAppointment;
    }
    catch (error) {
        console.error(error);
        return reply.code(500).send({
            message: "Internal Server Error",
        });
    }
});
exports.deleteAppointmentService = deleteAppointmentService;
// Get All Appointments
const getAllAppointmentsService = (reply, request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        if (!user || !user.user || !user.user.role) {
            return reply.code(403).send({
                message: "You are not authorized to perform this action. No role found.",
            });
        }
        // Check if the user is an admin
        if (user.user.role !== "Admin") {
            return reply.code(403).send({
                message: "You are not authorized to perform this action. Admin access required.",
            });
        }
        const appointments = yield prisma_1.default.appointment.findMany();
        return reply.code(200).send({
            message: "All appointments fetched successfully",
            appointments,
        });
    }
    catch (error) {
        return reply.code(500).send({
            message: error,
        });
    }
});
exports.getAllAppointmentsService = getAllAppointmentsService;
