"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect to the database
(0, db_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
