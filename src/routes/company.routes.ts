import { Router } from "express";
import companyController from "../controller/company.controller";
import projectController from "../controller/project.controller";

const companyRouter = Router();

companyRouter.post('/create', companyController.createCompany);

//Projects
companyRouter.post('/add-project', projectController.createProject)

export default companyRouter;