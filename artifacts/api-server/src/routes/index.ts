import { Router, type IRouter } from "express";
import healthRouter from "./health";
import foodImageRouter from "./food-image";

const router: IRouter = Router();

router.use(healthRouter);
router.use(foodImageRouter);

export default router;
