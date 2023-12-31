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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db/db"));
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const authorize_1 = require("../middleware/authorize");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get("/", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.session.userId);
    try {
        const result = yield db_1.default
            .select()
            .from(schema_1.events)
            .where((0, drizzle_orm_1.eq)(schema_1.events.userId, userId));
        return res.status(200).send(result);
    }
    catch (err) {
        return res.send({ message: "Couldn't get events" });
    }
}));
router.post("/", authorize_1.authorize, validation_1.validateEventSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newEvent = req.validatedEventData;
    try {
        const [result] = yield db_1.default.insert(schema_1.events).values(newEvent).returning();
        return res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        return res.status(400).send({ message: err });
    }
}));
router.put("/:id", authorize_1.authorize, validation_1.validateEventSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.id;
    const updatedEvent = req.validatedEventData;
    try {
        const [result] = yield db_1.default
            .update(schema_1.events)
            .set(updatedEvent)
            .where((0, drizzle_orm_1.eq)(schema_1.events.id, eventId))
            .returning();
        return res.status(200).send(result);
    }
    catch (err) {
        return res.status(400).send({ message: err });
    }
}));
router.delete("/:id", authorize_1.authorize, validation_1.validateDeleteEvent, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = req.params.id;
    const userId = Number(req.session.userId);
    try {
        yield db_1.default
            .delete(schema_1.events)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.id, eventId), (0, drizzle_orm_1.eq)(schema_1.events.userId, userId)))
            .returning();
        return res.status(200).json({ message: "Event successfully deleted" });
    }
    catch (err) {
        return res.status(400).send({ error: "Server error deleting event" });
    }
}));
exports.default = router;
