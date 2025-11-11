export function ensureBuffer(data: Buffer | ArrayBuffer | Uint8Array): Buffer {
    if (Buffer.isBuffer(data)) {
      return data;
    } else if (data instanceof ArrayBuffer) {
      return Buffer.from(data);
    } else if (data instanceof Uint8Array) {
      return Buffer.from(data);
    } else {
      // If it's already a proper Buffer, return as is
      return Buffer.from(data as any);
    }
  }