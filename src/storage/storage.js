import localforage from 'localforage';

export const localForage = localforage.createInstance({
  name: "maindb",
  version : 1.0,
  storeName : 'mainstorageobj'
});

localForage.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
]);

export default localForage;
