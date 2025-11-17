import { NextFunction, Request, Response } from "express";
import { RequirementAttribute } from "../types/requirement.types";
import requirementRepository from "../repository/requirement.repository";
import { errorResponse } from "../helpers/errorMsg.helper";

class AuthController {
   createRequirement = [
      async(req:Request<{}, {}, RequirementAttribute>, res: Response, next: NextFunction): Promise<void> => {
         try {
            const requirementDto = req.body;

            const requirementData = {
               title: requirementDto.title,
               description: requirementDto.description,
               workType: requirementDto.workType,
               minimumBudget: requirementDto.minimumBudget,
               maximumBudget: requirementDto.maximumBudget,
               category: requirementDto.category,
               timeline: requirementDto.timeline,
               skills: requirementDto.skills,
               attachment: requirementDto.attachment,
               urgency: requirementDto.urgency,
               userId: requirementDto.userId
            }

            const newRepository = await requirementRepository.createRequirement(requirementData);

            res.status(200).json({
               message: "Requirement created",
               body: newRepository
            })

         } catch (e) {
            errorResponse(e, res, "Error while registering to user");
            next(e); 
         }
      }
   ];
}

export default new AuthController;
