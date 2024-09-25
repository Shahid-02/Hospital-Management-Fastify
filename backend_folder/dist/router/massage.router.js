"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.massageRouter = void 0;
const massage_controllers_1 = require("../controllers/massage.controllers");
const massageRouter = (router, object, done) => {
    router.post("/send", massage_controllers_1.massageRegisterHandler);
    router.get("/getall", massage_controllers_1.getAllMassageHandler);
    done();
};
exports.massageRouter = massageRouter;
exports.default = exports.massageRouter;
