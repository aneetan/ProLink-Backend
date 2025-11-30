import { pipeline } from "@xenova/transformers";
import EmbeddingConfig from "../config/embeddings.config";
import pineconeService from "./pinecone.services";

let embedder: any = null;

class EmbeddingsService {
  // Load the model once and reuse it
  async loadModel() {
    if (!embedder) {
      embedder = await pipeline(
        EmbeddingConfig.model.name,         
        EmbeddingConfig.model.modelId,       
        {
          cache_dir: EmbeddingConfig.performance.cacheDir,
          revision: EmbeddingConfig.performance.revision
        }
      );
    }
    return embedder;
  }

  // Generate embeddings for a text
  async generateEmbeddings(text: string): Promise<number[]> {
    const model = await this.loadModel();

    const output = await model(text, {
      pooling: EmbeddingConfig.generation.pooling,    
      normalize: EmbeddingConfig.generation.normalize 
    });

    return Array.from(output.data);  
  }

  //generate and save client embeddings
  async saveClientEmbedding(
    text: string, 
    clientId?: string, 
    metadata: any = {}
  ) {
    try {
      const embedding = await this.generateEmbeddings(text);
      const vectorId = clientId || `client_${Date.now()}`;

      const savedVector = await pineconeService.saveEmbedding(
        vectorId,
        embedding,
        text,
        {
          entityType: 'client',
          ...metadata
        },
        'client'
      );

      return {
        id: vectorId,
        embedding,
        text,
        metadata: savedVector.metadata
      };
    } catch (error) {
      console.error('Error saving client embedding:', error);
      throw error;
    }
  }


  //GENERATE AND SAVE COMPANY EMBEDDINGS
   async saveCompanyEmbedding(
    text: string, 
    companyId?: string, 
    metadata: any = {}
  ) {
    try {
      const embedding = await this.generateEmbeddings(text);
      const vectorId = companyId || `company_${Date.now()}`;
      
      const savedVector = await pineconeService.saveEmbedding(
        vectorId,
        embedding,
        text,
        {
          entityType: 'company',
          ...metadata
        },
        'company' 
      );
      
      return {
        id: vectorId,
        embedding,
        text,
        metadata: savedVector.metadata
      };

    } catch (error) {
      console.error('Error saving company embedding:', error);
      throw error;
    }
  }

  // Find matching COMPANIES for a CLIENT
   async findCompaniesForClient(clientQuery: string, topK: number = 5) {
     try {
      const queryEmbedding = await this.generateEmbeddings(clientQuery);
      
      const results = await pineconeService.findMatchesAcrossNamespaces(
        queryEmbedding,
        'client',
        'company', // Search in company namespace
        topK
      );
      
      return results;

    } catch (error) {
      console.error('Error finding companies for client:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const embeddingService = new EmbeddingsService();
export default embeddingService;