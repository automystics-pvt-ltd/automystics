import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import adminRouter from "./admin";
import siteSettingsRouter from "./site-settings";
import locationsRouter from "./locations";
import demosRouter from "./demos";
import productsRouter from "./products";
import demoRequestsRouter from "./demo-requests";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(siteSettingsRouter);
router.use(locationsRouter);
router.use(demosRouter);
router.use(productsRouter);
router.use(demoRequestsRouter);
router.use("/admin", adminRouter);

export default router;
