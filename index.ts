import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import mongoSanitize = require('express-mongo-sanitize');
import hpp = require('hpp');
import helmet = require('helmet');

class App {
  public app = express();

  public port = process.env.PORT || 4000;

  constructor() {
    this.iniMiddleware();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`[server]: Running at http://localhost:${this.port}`);
    });
  }

  private iniMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(hpp());
    this.app.use(mongoSanitize());
    this.app.use(helmet());
  }
}

if (module === require.main) {
  new App().listen();
}
