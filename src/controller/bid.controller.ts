import { requireClient, requireCompany } from "../middleware/validateRole";
import { NextFunction, Request, Response } from "express";
import { BidRequestData } from "../types/bid.type";
import bidRepository from "../repository/bid.repository";
import { errorResponse } from "../helpers/errorMsg.helper";
import notificationController from "./notification.controller";
import notificationService from "../services/notification.service";


class BidController {
   createBidRequestWithNotification = [
      // requireClient,
      async(req:Request<{}, {}, BidRequestData>, res: Response, next: NextFunction): Promise<void> => {
         try {
            const { userId, companyId, requirementId, userName } = req.body;

            const bidRequest = {
               userId,
               companyId,
               requirementId,
               requestedAt: new Date()
            }

            if (!userId || !companyId || !requirementId) {
               res.status(400).json({ 
                  success: false, 
                  error: 'UserId, requirementId and companyId are required' 
               });
            }

            const newBidRequest = await bidRepository.createBidRequest(bidRequest);

            const notification = await notificationService.sendQuoteRequestSent(
               companyId, 
               userName, 
               requirementId
            );

            res.status(200).json({ 
               success: true, 
               message: 'Bid request created successfully',
                data: {
                  bidRequest: newBidRequest,
                  notification
               }
            });
            } catch (error: any) {
               errorResponse(error, res, error.message || "Failed to send quote request notifications");
            }
      }
   ]

   getBidRequestForCompany = [
      requireCompany,
      async(req:Request<{}, {}, BidRequestData>, res: Response, next: NextFunction): Promise<void> => {
         try {
            const { companyId } = req.body;

            if (!companyId) {
               res.status(400).json({ 
                  success: false, 
                  error: 'CompanyId is required' 
               });
            }

            const bids = await bidRepository.getBidRequestForCompany(companyId);

            res.status(200).json({ 
               success: true, 
               message: `Bid fetch for company ${companyId}`,
               bids
            });
         } catch (error: any) {
            errorResponse(error, res, error.message || "Failed to fetch bids for company");
         }
      }
   ]

   getBidForRequirement = [
      requireClient,
      async(req:Request<{}, {}, BidRequestData>, res: Response, next: NextFunction): Promise<void> => {
         try {
            const { requirementId } = req.body;

            if (!requirementId) {
               res.status(400).json({ 
                  success: false, 
                  error: 'CompanyId is required' 
               });
            }

            const bids = await bidRepository.getBidRequestFprRequirement(requirementId);

            res.status(200).json({ 
               success: true, 
               message: `Bid fetch for requirement ${requirementId}`,
               bids
            });
         } catch (error: any) {
            errorResponse(error, res, error.message || "Failed to fetch bids for company");
         }
      }
   ]
}

export default new BidController();