// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  roots: [ '<rootDir>/tests' ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/infrastructure/repositories/**/*.repository.{ts,js}',
    '!src/infrastructure/controllers/**/*.controller.{ts,js}',
  ],
  reporters: [ 'default', [ 'jest-junit', { outputDirectory: './coverage' } ] ],
  setupFiles: [ '<rootDir>/tests/test.setup.ts' ],
  snapshotFormat: {
    printBasicPrototype: true,
  },
};
