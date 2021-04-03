"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const _1 = require(".");
class Database {
    constructor() {
        this.connected = 0;
        this.url = _1.default.mongo.MONGO_URI;
        this.params = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            poolSize: 1,
            socketTimeoutMS: 2000000,
            keepAlive: true,
        };
    }
    async connect() {
        try {
            if (this.connected) {
                console.info(`MongoDB connected: ${await this.db.connection.host}`);
                return this.connected;
            }
            this.db = await mongoose.connect(this.url, this.params);
            this.connected = this.db.connections[0].readyState;
            console.log(`MongoDB connected: ${await this.db.connection.host}`);
            return this.connected;
        }
        catch (error) {
            console.error('Error connecting to database ', error);
            return process.exit(1);
        }
    }
}
const db = new Database();
if (process.env.ENV !== 'test')
    db.connect();
exports.default = db;
//# sourceMappingURL=database.js.map