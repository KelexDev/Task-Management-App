/* eslint-env jest */
const mockStorage = new Map();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key) => mockStorage.get(key) ?? null),
  setItem: jest.fn(async (key, value) => {
    mockStorage.set(key, value);
  }),
  removeItem: jest.fn(async (key) => {
    mockStorage.delete(key);
  }),
  clear: jest.fn(async () => {
    mockStorage.clear();
  }),
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: '[DEFAULT]' })),
}));

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(async () => ({ id: 'task-1' })),
  collection: jest.fn(() => ({})),
  deleteDoc: jest.fn(async () => {}),
  doc: jest.fn(() => ({})),
  getDocs: jest.fn(async () => ({ docs: [] })),
  getFirestore: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  updateDoc: jest.fn(async () => {}),
}));
