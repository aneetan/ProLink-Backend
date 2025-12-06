import prisma from "../config/dbconfig";
import { BidRequestData } from "../types/bid.type";

class BidRepository {
   /**
   * Store bid request in database
   */
  async createBidRequest(bid: Omit<BidRequestData, 'id'>): Promise<BidRequestData> {
      const bidRequest =  await prisma.bidRequest.create({
        data: {
          userId: bid.userId,
          companyId: bid.companyId,
          requirementId: bid.requirementId,
          requestedAt: new Date(),
          status: bid.status
        }
      });

      return bidRequest;
  }

   async getBidRequestForCompany(companyId: number): Promise<BidRequestData[]> {
      const bidRequests = await prisma.bidRequest.findMany({
         where: { companyId },
      });

      return bidRequests;
   }

   async getBidRequestFprRequirement(requirementId: number): Promise<BidRequestData[]> {
      const bidRequests = await prisma.bidRequest.findMany({
         where: { requirementId },
      });

      return bidRequests;
   }

}

export default new BidRepository();