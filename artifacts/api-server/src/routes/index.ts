import { Router, type IRouter } from "express";
import healthRouter from "./health";
// authRouter removed — student auth deleted (⑤)
import checkoutRouter from "./checkout";
import adminRouter from "./admin";
import adminSectionsRouter from "./adminSections";
import blogRouter from "./blog";
import ratesRouter from "./rates";
import voiceEvaluationRouter from "./voiceEvaluation";
import coursesRouter from "./courses";

const router: IRouter = Router();

router.use(healthRouter);
// router.use(authRouter); — removed (⑤)
router.use(coursesRouter);
router.use(checkoutRouter);
router.use(blogRouter);
router.use(ratesRouter);
router.use(voiceEvaluationRouter);
router.use("/admin", adminRouter);
router.use("/admin", adminSectionsRouter);

export default router;
