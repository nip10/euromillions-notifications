import express, {
  Response,
  Request,
  NextFunction,
  ErrorRequestHandler,
} from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import routes from "./routes/notification";
import updateNotifications from "./scripts/updatenotifications";
import { ERROR } from "./utils/constants";

dotenv.config();
const { NODE_ENV, CLIENT_DEV_PORT, BASE_URL } = process.env;
const isProd = NODE_ENV === "production";

const app = express();

const whitelist = [
  `http://localhost:${CLIENT_DEV_PORT}`,
  `https://${BASE_URL}`,
  `https://www.${BASE_URL}`,
];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

if (NODE_ENV === "production") {
  updateNotifications.start();
}

// Handle 404s
app.use((req: Request, res: Response) => {
  const err = new Error("Page Not Found.");
  return res.status(404).json({ error: err });
});

// Handle server errors
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (res.headersSent) {
      return next(err);
    }
    return res.status(500).json({ error: isProd ? ERROR.SERVER : err });
  }
);

export default app;
