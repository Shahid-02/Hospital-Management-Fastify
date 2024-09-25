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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageService = exports.patientLogoutService = exports.adminLogoutService = exports.getAllDoctorsService = exports.doctorRegisterService = exports.adminRegisterService = exports.loginPatientService = exports.patientRegisterService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashPassword_1 = require("../utils/hashPassword");
const cloudinary_1 = require("../utils/cloudinary");
// Register Patient
const patientRegisterService = (data, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patientExists = yield prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (patientExists) {
            return reply.code(401).send({
                message: "Email already exists",
            });
        }
        const { password } = data, newUser = __rest(data, ["password"]);
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const patient = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, newUser), { password: hashedPassword, role: "Patient" }),
        });
        return patient;
    }
    catch (error) {
        console.error(error);
    }
});
exports.patientRegisterService = patientRegisterService;
// login service
const loginPatientService = (data, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find  patient
        const patient = yield prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (!patient) {
            return reply.code(401).send({ message: "Invalid email or password" });
        }
        if (data.password !== data.confirmPassword) {
            return reply.code(400).send({
                massage: "Password & Confirm Password Do Not Match!",
            });
        }
        // compare password
        const isMatch = yield (0, hashPassword_1.comparePassword)(data.password, patient.password);
        if (!isMatch) {
            return reply.code(401).send({ message: "Invalid email or password" });
        }
        // generate token
        const payload = {
            user: patient,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.EXPIRES_JWT,
        });
        const cookieName = patient.role === "Admin" ? "adminToken" : "patientToken";
        // Set the JWT token in a cookie
        reply.setCookie(cookieName, token, {
            // httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // sameSite: "strict",
            path: "/",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });
        return {
            token,
            patient,
        };
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.loginPatientService = loginPatientService;
//   Add New Admin  service
const adminRegisterService = (data, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminExists = yield prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (adminExists) {
            return reply.code(401).send({ message: "Email already exists" });
        }
        const { password } = data, newUser = __rest(data, ["password"]);
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const admin = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, newUser), { password: hashedPassword, role: "Admin" }),
        });
        return admin;
    }
    catch (error) {
        console.error(error);
    }
});
exports.adminRegisterService = adminRegisterService;
// Add New Doctor Service
const doctorRegisterService = (data, reply, request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Received data:", data.email);
        const existingDoctor = yield prisma_1.default.user.findUnique({
            where: { email: data.email },
        });
        if (existingDoctor) {
            reply.code(409).send({ message: "Email already exists" });
            return null;
        }
        const { password } = data, newUser = __rest(data, ["password"]);
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const doctor = yield prisma_1.default.user.create({
            data: Object.assign(Object.assign({}, newUser), { password: hashedPassword, role: "Doctor" }),
        });
        const files = yield request.saveRequestFiles();
        if (!files || files.length === 0) {
            reply.code(400).send({ message: "No file uploaded" });
            return null;
        }
        const file = files[0];
        const filePath = file.filepath;
        // Upload the file to Cloudinary
        const img = yield (0, cloudinary_1.uploadOnCloudinary)(filePath);
        if (!img) {
            reply.code(500).send({ message: "Failed to upload image" });
            return null;
        }
        console.log(img, "Image uploaded successfully");
        return doctor;
    }
    catch (error) {
        console.error("Error in doctorRegisterService:", error);
        reply.code(500).send({ message: "Internal Server Error" });
        return null;
    }
});
exports.doctorRegisterService = doctorRegisterService;
// Get All The Doctor Services
const getAllDoctorsService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma_1.default.user.findMany({
            where: { role: "Doctor" },
        });
        return doctors;
    }
    catch (error) {
        console.error(error);
    }
});
exports.getAllDoctorsService = getAllDoctorsService;
// Admin LogOut
const adminLogoutService = (reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set the JWT token in a cookie
        reply.clearCookie("adminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(Date.now() - 1),
        });
        return { message: "Logged out successfully!" };
    }
    catch (error) {
        console.error(error);
        reply.code(500).send({ message: error });
    }
});
exports.adminLogoutService = adminLogoutService;
// Patient LogOut
const patientLogoutService = (reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set the JWT token in a cookie
        reply.clearCookie("patientToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            expires: new Date(Date.now() - 1),
        });
        return { message: "Logged out successfully!" };
    }
    catch (error) {
        console.error(error);
        reply.code(500).send({ message: error });
    }
});
exports.patientLogoutService = patientLogoutService;
const uploadImageService = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = request.user;
        // Access user.id from user.user
        const userId = Number((_a = user.user) === null || _a === void 0 ? void 0 : _a.id);
        // console.log(userId);
        const files = yield request.saveRequestFiles();
        if (!files || files.length === 0) {
            return reply.code(400).send({ message: "No file uploaded" });
        }
        const file = files[0];
        const filePath = file.filepath;
        // Upload the file to Cloudinary
        const img = yield (0, cloudinary_1.uploadOnCloudinary)(filePath);
        const response = yield prisma_1.default.docImage.create({
            data: {
                publicId: img === null || img === void 0 ? void 0 : img.public_id,
                url: img === null || img === void 0 ? void 0 : img.url,
                userId: userId,
            },
        });
        return response;
    }
    catch (error) {
        console.error(error);
        reply.code(500).send({ message: error });
    }
});
exports.uploadImageService = uploadImageService;
