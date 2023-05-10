
import * as dotenv from 'dotenv'
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./src/routes/auth.routes";
import callToRoutes from "./src/routes/callto.routes";
import usersRoutes from "./src/routes/user.routes";
import { createRoles } from "./src/libs/initialSetup";

import "./src/database";

const app = express();

createRoles();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(morgan("dev"));

app.use('/api/auth', authRoutes)
app.use('/api/callto', callToRoutes)
app.use('/api/users', usersRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});