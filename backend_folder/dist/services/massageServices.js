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
exports.getAllMassageService = exports.massageRegisterService = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const massageRegisterService = (data, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const massage = yield prisma_1.default.message.create({
            data,
        });
        return massage;
    }
    catch (error) {
        reply.code(401).send({
            massage: "Massage Send Failed",
        });
    }
});
exports.massageRegisterService = massageRegisterService;
const getAllMassageService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const massage = yield prisma_1.default.message.findMany();
        return massage;
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllMassageService = getAllMassageService;
