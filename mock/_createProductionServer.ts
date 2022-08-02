import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

const modules = import.meta.globEager('./**/*.ts');
const viewMocks = import.meta.globEager('/src/views/**/mock.ts');

const mockModules: any[] = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...modules[key].default);
});

Object.keys(viewMocks).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...viewMocks[key].default);
});

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
