"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const helmet = require("helmet");
require('./config/database');
const error_1 = require("./middlewares/error");
const routeNotFound_1 = require("./errors/routeNotFound");
const routes_1 = require("./routes");
class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.iniMiddleware();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.info(`[server]: Running at http://localhost:${this.port}`);
        });
    }
    iniMiddleware() {
        this.app.use(cors());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(hpp());
        this.app.use(mongoSanitize());
        this.app.use(helmet());
        this.app.use(routes_1.default);
        this.app.use((req, res, next) => next(new routeNotFound_1.default()));
        this.app.use(error_1.default);
    }
}
if (module === require.main) {
    new App().listen();
}
//# sourceMappingURL=index.js.map