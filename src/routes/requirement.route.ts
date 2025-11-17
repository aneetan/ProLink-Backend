import { Router } from "express";
import requirementController from "../controller/requirement.controller";

const requirementRouter = Router();

requirementRouter.post('/create', requirementController.createRequirement);

export default requirementRouter;