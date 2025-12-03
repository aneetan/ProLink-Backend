import { PrismaClient, Project } from "@prisma/client";
import { RequirementAttribute } from "../types/requirement.types";
import { ProjectAttributes } from "../types/company/project.types";

const prisma = new PrismaClient();

class ProjectRepository {
   async createProject(userId: number, userData: Omit<ProjectAttributes, "id">): Promise<Project> {
         const {title, description, completionDate, projectUrl, imageUrl} = userData;

          const company = await prisma.company.findFirst({ where: { userId } });
   
         return await prisma.project.create({
            data: {
               title,
               description,
               completionDate,
               projectUrl,
               imageUrl,
               companyId: company.id
            }
         });
      }
}

export default new ProjectRepository();
