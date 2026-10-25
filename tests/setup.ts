import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

function createStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    key: (index) => [...store.keys()][index] ?? null,
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  } as Storage;
}

// Node >= 22 defines `localStorage` as a getter that only works with --localstorage-file, and
// vitest leaves globals the runtime already defines, so it shadows happy-dom's implementation.
// Reading the property would emit an ExperimentalWarning per process, so the descriptor is
// inspected instead; any real Storage value (happy-dom's) short-circuits the polyfill.
const native = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
if (!native || !("value" in native) || !native.value) {
  const storage = createStorage();
  Object.defineProperty(globalThis, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
}

afterEach(() => {
  cleanup();
});
