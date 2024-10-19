import express, { Application } from "express";
import cors from "cors";
import { UserRouter } from "./app/modules/user/user.route";
import { PostRouter } from "./app/modules/post/post.route";
import { NotificationRouter } from "./app/modules/notification/notification.route";
import { MinioRouter } from "./app/modules/minio/minio.route";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cors());

// routers
app.use("/users", UserRouter);
app.use("/posts", PostRouter);
app.use("/notifications", NotificationRouter);
app.use("/minio-bucket", MinioRouter);

console.log(process.cwd());

export default app;





// req.params
// req.query

// Middleware
// const logger = (req: Request, res: Response, next: NextFunction) => {
//   console.log(req.url, req.method, req.hostname);
//   next();
// };

// app.get("/", logger, (req: Request, res: Response) => {
//   res.send("Hello world!");
// });

// app.post("/", (req: Request, res: Response) => {
//   console.log(req.body);
//   res.send("API hit!");
// });

// test api
// userRouter.post("/create-user", (req: Request, res: Response) => {
//   const user = req.body;
//   console.log(user);
//   res.json({
//     success: true,
//     message: "User created successfully",
//     data: user,
//   });
// });