import embeddingService from "./embeddings.service";

export class WebhookService {
  
  // Process REQUIREMENT in background after creation
  async processNewRequirement(requirementId: number, requirementData: any) {
    try {
      console.log(`🪝 Webhook: Processing new requirement ${requirementId}`);
      
      // Use the existing method from embeddingService
      embeddingService.saveRequirementEmbeddings(requirementId)
        .then(() => {
          console.log(`✅ Embedding generated for requirement ${requirementId}`);
        })
        .catch(error => {
          console.error(`Failed to generate embedding for requirement ${requirementId}:`, error);
        });

    } catch (error) {
      console.error(`Webhook processing failed for requirement ${requirementId}:`, error);
    }
  }

  // Process COMPANY in background after creation
  async processNewCompany(companyId: number, companyData: any) {
    try {
      console.log(`🪝 Webhook: Processing new company ${companyId}`);
      
      // Use the existing method from embeddingService
      embeddingService.saveCompanyEmbedding(companyId)
        .then(() => {
          console.log(`✅ Embedding generated for company ${companyId}`);
        })
        .catch(error => {
          console.error(`Failed to generate embedding for company ${companyId}:`, error);
        });

    } catch (error) {
      console.error(`Webhook processing failed for company ${companyId}:`, error);
    }
  }

  // Find matching companies for a requirement
  async findCompaniesForRequirement(requirementId: number, topK: number = 5) {
    try {
      console.log(`Finding companies for requirement ${requirementId}`);
      
      const results = await embeddingService.findCompaniesForRequirement(requirementId, topK);
      console.log(`Found ${results.length} matching companies for requirement ${requirementId}`);
      
      return results;

    } catch (error) {
      console.error(`Error finding companies for requirement ${requirementId}:`, error);
      throw error;
    }
  }

  // Batch process multiple requirements
  async batchProcessRequirements(requirementIds: number[]) {
    console.log(`🔄 Batch processing ${requirementIds.length} requirements...`);
    
    const results = [];
    for (const requirementId of requirementIds) {
      try {
        await embeddingService.saveRequirementEmbeddings(requirementId);
        results.push({ id: requirementId, success: true });
      } catch (error) {
        results.push({ id: requirementId, success: false, error: error.message });
      }
    }
    
    console.log(`Batch processing completed: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    return results;
  }

  // Batch process multiple companies
  async batchProcessCompanies(companyIds: number[]) {
    console.log(`🔄 Batch processing ${companyIds.length} companies...`);
    
    const results = [];
    for (const companyId of companyIds) {
      try {
        await embeddingService.saveCompanyEmbedding(companyId);
        results.push({ id: companyId, success: true });
      } catch (error) {
        results.push({ id: companyId, success: false, error: error.message });
      }
    }
    
    console.log(`Batch processing completed: ${results.filter(r => r.success).length} successful, ${results.filter(r => !r.success).length} failed`);
    return results;
  }
}

export const webhookService = new WebhookService();