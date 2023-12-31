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
    try {
        const result = yield db_1.default
            .select()
            .from(schema_1.contacts)
            .where((0, drizzle_orm_1.eq)(schema_1.contacts.userId, Number(req.session.userId)));
        return res.status(200).json(result);
    }
    catch (_a) {
        return res.send({ message: "Couldn't get contacts" });
    }
}));
router.post("/", authorize_1.authorize, validation_1.validateContactSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newContact = req.validatedContactData;
    try {
        const [result] = yield db_1.default
            .insert(schema_1.contacts)
            .values(newContact)
            .returning();
        return res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        return res.status(400).send({ message: "Couldn't insert contact" });
    }
}));
router.put("/:id", authorize_1.authorize, validation_1.validateContactSchema, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactId = Number(req.params.id);
    const updatedContact = req.validatedContactData;
    try {
        const [result] = yield db_1.default
            .update(schema_1.contacts)
            .set(updatedContact)
            .where((0, drizzle_orm_1.eq)(schema_1.contacts.id, contactId))
            .returning();
        return res.status(200).send(result);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Couldn't update contact" });
    }
}));
router.delete("/:id", authorize_1.authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactId = Number(req.params.id);
    if (!contactId) {
        return res.status(400).send({ message: "Must supply a contact" });
    }
    try {
        const [result] = yield db_1.default
            .delete(schema_1.contacts)
            .where((0, drizzle_orm_1.eq)(schema_1.contacts.id, contactId))
            .returning();
        return res.status(200).send(result);
    }
    catch (err) {
        return res.status(400).send(err);
    }
}));
exports.default = router;
