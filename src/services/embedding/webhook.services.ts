import embeddingService from "./embeddings.service";

export class WebhookService {
  
  // Process requirement in background after creation
  async processNewRequirement(requirementId: number, requirementData: any) {
    try {
      console.log(`🪝 Webhook: Processing new requirement ${requirementId}`);
      
      // Generate embedding in background (don't await - fire and forget)
      this.generateRequirementEmbedding(requirementId, requirementData)
        .then(() => {
          console.log(`✅ Embedding generated for requirement ${requirementId}`);
        })
        .catch(error => {
          console.error(`❌ Failed to generate embedding for requirement ${requirementId}:`, error);
        });

    } catch (error) {
      console.error(`❌ Webhook processing failed for requirement ${requirementId}:`, error);
    }
  }

  // Generate embedding for requirement
  async generateRequirementEmbedding(requirementId: number, requirementData: any) {
    try {
      // Build embedding text from requirement data
      const embeddingText = this.buildRequirementEmbeddingText(requirementData);
      
      // Generate and save embedding
      await embeddingService.saveRequirementEmbeddings(requirementId);
      
    } catch (error) {
      console.error(`❌ Embedding generation failed for requirement ${requirementId}:`, error);
      throw error;
    }
  }

  // Build text for embedding generation
  async buildRequirementEmbeddingText(requirementData: any) {
    const parts = [
      requirementData.title,
      requirementData.description,
      `Work type: ${requirementData.workType}`,
      `Category: ${requirementData.category}`,
      `Skills needed: ${requirementData.skills?.join(', ') || ''}`,
      `Urgency: ${requirementData.urgency}`,
      `Budget: $${requirementData.minimumBudget} to $${requirementData.maximumBudget}`,
      `Timeline: ${requirementData.timeline}`
    ];

    return parts.filter(part => part && part.trim()).join('. ');
  }
}

export const webhookService = new WebhookService();