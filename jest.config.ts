// require('dotenv').config({ path: '.env.test' });

const esModules = ['.*\\.mjs$', 'bcrypt-ts', 'nanoid', 'next-mdx-remote'].join('|');

const config = {
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '^bcrypt-ts$': '<rootDir>/node_modules/bcrypt-ts',
    '^nanoid$': 'nanoid',
  },
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
  testMatch: ['<rootDir>/src/test/**/*.(test|spec).ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [`!node_modules/(?!${esModules})`],
  maxWorkers: 1, //process.env.CI || process.env.IDE_TEST ? 1 : '50%',
  // runInBand: !!(process.env.CI || process.env.IDE_TEST),
  clearMocks: true,

  // Force exit after all tests complete
  forceExit: true,
};

export default config;
