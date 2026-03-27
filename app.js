import express from "express";
import morgan from "morgan";
import cors from "cors";
import getUserFromToken from "./middleware/getUserFromToken.js";
import usersRouter from "./api/users.js";
import applicationsRouter from "./api/applications.js";

const app = express();
const allowedOrigins = [
  "https://git-ghosted.netlify.app",
  "https://git-ghosted.netlify.app/register",
  "https://git-ghosted.netlify.app/login",
  "https://git-ghosted.netlify.app/dashboard",
  "https://git-ghosted.netlify.app/applications",
  "https://git-ghosted.netlify.app/applications/:id",
  "https://git-ghosted.netlify.app/applications/:id/edit",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(getUserFromToken);

app.use("/applications", applicationsRouter);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message,
    code: err.code,
    detail: err.detail,
  });
});

export default app;
