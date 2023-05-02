import express from "express";
import morgan from "morgan";
import cors from "cors";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/user.routes";
import { createRoles } from "./libs/initialSetup";

const app = express();
createRoles();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true}))


app.use(morgan("dev"));

app.use('/api/products', productsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)

export default app
