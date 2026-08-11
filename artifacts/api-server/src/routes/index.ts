import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import checkoutRouter from "./checkout";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(checkoutRouter);
router.use("/admin", adminRouter);

export default router;
