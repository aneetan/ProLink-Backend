import { Router } from "express";
import bidController from "../controller/bid.controller";
import requirementController from "../controller/requirement.controller";

const clientRouter = Router();

clientRouter.post('/requirement/create', requirementController.createRequirement);

clientRouter.get('/:requirementId/similar-companies', requirementController.findMatchingCompanies);
clientRouter.get('/requirement', requirementController.getRequirementForUser);

clientRouter.post('/request-bid', bidController.createBidRequestWithNotification)
clientRouter.get('/:requirementId/bid', bidController.getBidRequestForRequirement)

clientRouter.get('/quote', bidController.getQuoteForRequirement)
clientRouter.put('/accept-quote/:quoteId', bidController.acceptQuoteByClient)
clientRouter.put('/decline-quote/:quoteId', bidController.declineQuoteByClient)


export default clientRouter;