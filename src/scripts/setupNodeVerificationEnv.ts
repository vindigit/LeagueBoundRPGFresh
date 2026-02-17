type AsyncStorageLike = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
};

let initialized = false;

export const setupNodeVerificationEnv = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  const asyncStorageMemory = new Map<string, string>();
  const asyncStorageModule = await import("@react-native-async-storage/async-storage");
  const asyncStorage = asyncStorageModule.default as AsyncStorageLike;

  asyncStorage.getItem = async (key: string): Promise<string | null> => asyncStorageMemory.get(key) ?? null;
  asyncStorage.setItem = async (key: string, value: string): Promise<void> => {
    asyncStorageMemory.set(key, value);
  };
  asyncStorage.removeItem = async (key: string): Promise<void> => {
    asyncStorageMemory.delete(key);
  };
  asyncStorage.clear = async (): Promise<void> => {
    asyncStorageMemory.clear();
  };

  initialized = true;
};
