const productRequestQueue: Array<() => Promise<unknown>> = [];
let isProcessingProductQueue = false;

const processProductQueue = async (): Promise<void> => {
  if (isProcessingProductQueue) return;
  isProcessingProductQueue = true;
  while (productRequestQueue.length > 0) {
    const task = productRequestQueue.shift()!;
    await task();
  }
  isProcessingProductQueue = false;
};

export const enqueueProductRequest = <T>(task: () => Promise<T>): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    productRequestQueue.push(async () => {
      try {
        resolve(await task());
      } catch (error) {
        reject(error);
      }
    });
    processProductQueue();
  });
};
