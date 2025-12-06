import { Router } from "express";
import companyController from "../controller/company.controller";
import projectController from "../controller/project.controller";
import paymentController from "../controller/payment.controller";
import bidController from "../controller/bid.controller";
import requirementController from "../controller/requirement.controller";

const clientRouter = Router();

clientRouter.post('/requirement/create', requirementController.createRequirement);

clientRouter.get('/:requirementId/similar-companies', requirementController.findMatchingCompanies);

clientRouter.post('/request-bid', bidController.createBidRequestWithNotification)
clientRouter.get('/:requirementId/bid', bidController.getBidForRequirement)

export default clientRouter;