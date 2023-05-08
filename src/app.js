import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import callToRoutes from "./routes/callto.routes";
import usersRoutes from "./routes/user.routes";
import { createRoles } from "./libs/initialSetup";

const app = express();
createRoles();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(morgan("dev"));

app.use('/api/auth', authRoutes)
app.use('/api/callto', callToRoutes)
// app.use('/api/users', usersRoutes)

export default app
