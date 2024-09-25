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
const authenticationUser = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const publicRoutes = new Set([
        "/api/v1/user/patient/register",
        "/api/v1/user/login",
    ]);
    const requestUrl = (_a = request.raw.url) !== null && _a !== void 0 ? _a : "";
    // Allow public routes to bypass authentication
    if (publicRoutes.has(requestUrl)) {
        return;
    }
    try {
        // Get the token from cookies
        const cookie = request.headers.cookie;
        let patientToken = null;
        let adminToken = null;
        if (cookie) {
            const matchedPatient = cookie.match(/patientToken=([^;]*)/);
            const matchedAdmin = cookie.match(/adminToken=([^;]*)/);
            patientToken = matchedPatient ? matchedPatient[1] : null;
            adminToken = matchedAdmin ? matchedAdmin[1] : null;
        }
        // If neither patientToken nor adminToken is found, throw an error
        if (!patientToken && !adminToken) {
            throw new Error("Token not found");
        }
        // Attach the token to the request headers so that jwtVerify can use it
        if (adminToken) {
            request.headers.authorization = `Bearer ${adminToken}`;
        }
        else if (patientToken) {
            request.headers.authorization = `Bearer ${patientToken}`;
        }
        // Verify the JWT token
        yield request.jwtVerify();
    }
    catch (error) {
        reply.code(401).send({
            message: error.message || "Unauthorized",
        });
    }
});
exports.default = authenticationUser;
