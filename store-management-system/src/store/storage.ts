const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? {
        getItem(key: string) {
          try {
            return Promise.resolve(localStorage.getItem(key));
          } catch {
            return Promise.resolve(null);
          }
        },
        setItem(key: string, value: string) {
          try {
            localStorage.setItem(key, value);
            return Promise.resolve(value);
          } catch {
            return Promise.resolve(value);
          }
        },
        removeItem(key: string) {
          try {
            localStorage.removeItem(key);
            return Promise.resolve();
          } catch {
            return Promise.resolve();
          }
        },
      }
    : createNoopStorage();

export default storage;
