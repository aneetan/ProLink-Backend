// src/services/EmbeddingService.ts
import { pipeline } from "@xenova/transformers";
import EmbeddingConfig from "../config/embeddings.config";

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
}

// Create and export a singleton instance
const embeddingService = new EmbeddingsService();
export default embeddingService;