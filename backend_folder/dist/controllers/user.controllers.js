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
exports.uploadImageHandler = exports.getUserDetailsHandler = exports.patientLogoutHandler = exports.adminLogoutHandler = exports.getAllDoctorsHandler = exports.docterRegisterHandler = exports.adminRegisterHandler = exports.patientLoginHandler = exports.patientRegisterHandler = void 0;
const userServices_1 = require("../services/userServices");
// Register Patient
const patientRegisterHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const patient = yield (0, userServices_1.patientRegisterService)(body, reply);
        reply.code(201).send({
            message: "User Registered!",
            data: {
                patient,
            },
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.patientRegisterHandler = patientRegisterHandler;
// login Patient and Admin
const patientLoginHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const patient = yield (0, userServices_1.loginPatientService)(body, reply);
        reply.send({
            message: "Login Successfully!",
            data: patient,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.patientLoginHandler = patientLoginHandler;
// Register  Admin
const adminRegisterHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const admin = yield (0, userServices_1.adminRegisterService)(body, reply);
        reply.send({
            message: "New Admin Registered!",
            data: {
                admin,
            },
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.adminRegisterHandler = adminRegisterHandler;
// Register Docter
const docterRegisterHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const docter = yield (0, userServices_1.doctorRegisterService)(body, reply, request);
        reply.code(201).send({
            message: "New Doctor Registered!",
            data: docter,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.docterRegisterHandler = docterRegisterHandler;
// Get All The Doctor
const getAllDoctorsHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield (0, userServices_1.getAllDoctorsService)();
        reply.send({
            message: "All Doctors",
            data: {
                doctors,
            },
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.getAllDoctorsHandler = getAllDoctorsHandler;
// Admin  logOut
const adminLogoutHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logOutAdmin = yield (0, userServices_1.adminLogoutService)(reply);
        reply.code(200).send({
            message: "Admin Logged Out Successfully.",
            data: logOutAdmin,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.adminLogoutHandler = adminLogoutHandler;
// Patient logOut
const patientLogoutHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logOutPatient = yield (0, userServices_1.patientLogoutService)(reply);
        reply.code(200).send({
            message: "Patient Logged Out Successfully.",
            data: logOutPatient,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.patientLogoutHandler = patientLogoutHandler;
// Patient Details
const getUserDetailsHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        reply.send({
            message: "User Details",
            data: user,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({
            message: error,
        });
    }
});
exports.getUserDetailsHandler = getUserDetailsHandler;
const uploadImageHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const upload = yield (0, userServices_1.uploadImageService)(request, reply);
        // Respond with success
        return reply.code(201).send({
            message: "File uploaded successfully",
            data: upload,
        });
    }
    catch (error) {
        console.error("Error uploading image:", error);
        reply.code(500).send({ message: "Failed to upload image" });
    }
});
exports.uploadImageHandler = uploadImageHandler;
