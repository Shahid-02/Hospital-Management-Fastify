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
exports.getAllMassageHandler = exports.massageRegisterHandler = void 0;
const massageServices_1 = require("../services/massageServices");
const massageRegisterHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = request.body;
        const message = yield (0, massageServices_1.massageRegisterService)(body, reply);
        reply.code(201).send({
            message: "Message Send!",
            data: message,
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.massageRegisterHandler = massageRegisterHandler;
const getAllMassageHandler = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield (0, massageServices_1.getAllMassageService)();
        reply.send({
            message: "All Messages",
            data: {
                messages,
            },
        });
    }
    catch (error) {
        console.log(error);
        reply.code(500).send({ message: error });
    }
});
exports.getAllMassageHandler = getAllMassageHandler;
