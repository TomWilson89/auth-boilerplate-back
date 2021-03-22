import mongoose = require('mongoose');

import config from '.';

interface IConnectParams {
  useNewUrlParser: boolean;
  useCreateIndex: boolean;
  useFindAndModify: boolean;
  useUnifiedTopology: boolean;
  bufferCommands?: boolean;
  bufferMaxEntries?: number;
  reconnectTries?: number;
  reconnectInterval?: number;
  poolSize?: number;
  socketTimeoutMS?: number;
  keepAlive?: boolean;
}

class Database {
  private params: IConnectParams;

  public db: mongoose.Mongoose;

  public connected = 0;

  private url = config.mongo.MONGO_URI;

  constructor() {
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

  public async connect(): Promise<number> {
    try {
      if (this.connected) {
        console.info(`MongoDB connected: ${await this.db.connection.host}`);
        return this.connected;
      }

      this.db = await mongoose.connect(this.url, this.params);

      this.connected = this.db.connections[0].readyState;

      console.log(`MongoDB connected: ${await this.db.connection.host}`);
      return this.connected;
    } catch (error) {
      console.error('Error connecting to database ', error);
      return process.exit(1);
    }
  }
}

const db = new Database();

if (process.env.ENV !== 'test') db.connect();

export default db;
