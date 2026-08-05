"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const app_module_1 = require("../src/app.module");
const server = (0, express_1.default)();
let isInitialized = false;
let initPromise = null;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.enableCors();
    await app.init();
    isInitialized = true;
}
async function handler(req, res) {
    if (!isInitialized) {
        if (!initPromise) {
            initPromise = bootstrap();
        }
        await initPromise;
    }
    server(req, res);
}
//# sourceMappingURL=index.js.map