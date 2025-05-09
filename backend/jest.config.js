// jest.config.js
import { defaults } from 'jest-config';

/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {}
};
