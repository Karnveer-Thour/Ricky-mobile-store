export async function register() {
  if (typeof window === "undefined" && typeof globalThis !== "undefined") {
    const storageMock = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
    try {
      Object.defineProperty(globalThis, "localStorage", {
        value: storageMock,
        configurable: true,
        writable: true,
      });
      Object.defineProperty(globalThis, "sessionStorage", {
        value: storageMock,
        configurable: true,
        writable: true,
      });
    } catch {
      // ignore
    }
  }
}
