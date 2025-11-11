export class BufferConverter {
  /**
   * Convert any binary data to Prisma-compatible Buffer
   */
  static toPrismaBytes(data: File | Buffer | ArrayBuffer | Uint8Array | null): Buffer {
    if (!data) {
      return Buffer.from([]);
    }

    // If it's already a Buffer, return as is
    if (Buffer.isBuffer(data)) {
      return data;
    }

    // If it's a File object (from browser), this should be handled differently
    if (data instanceof File) {
      throw new Error('File objects must be converted before calling this method');
    }

    // Handle ArrayBuffer and Uint8Array
    if (data instanceof ArrayBuffer) {
      return Buffer.from(new Uint8Array(data));
    }

    if (data instanceof Uint8Array) {
      return Buffer.from(data);
    }

    // Last resort - try direct conversion
    try {
      const uint8Array = new Uint8Array(data as any);
      return Buffer.from(uint8Array);
    } catch (error) {
      console.warn('Direct conversion failed, returning empty buffer');
      return Buffer.from([]);
    }
  }

  /**
   * Convert File to Buffer (for browser environment)
   */
  static async fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to Buffer properly
          const arrayBuffer = reader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          const buffer = Buffer.from(uint8Array);
          resolve(buffer);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => reject(new Error(`File reading error: ${reader.error}`));
      reader.readAsArrayBuffer(file);
    });
  }
}