import localForage from "localforage";

export const localForageStore = localForage.createInstance({
  name: "QueryMakerLocalStorageDB",
  version: 1.0,
  storeName: "QueryMakerLocalStorageStore",
  driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});
