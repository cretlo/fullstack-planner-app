"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
// query purposes
const queryClient = (0, postgres_1.default)("postgres://postgres:postgres@localhost:5432/planner");
const db = (0, postgres_js_1.drizzle)(queryClient);
exports.default = db;
