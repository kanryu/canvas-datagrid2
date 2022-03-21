module.exports = {
    setupFiles: ["jest-canvas-mock"],
    transform: {
      '^.+\\.ts?$': 'ts-jest'
//        '^.+\\.ts?$': "rollup-jest"
    },
    moduleNameMapper: {
        "@/(.+)": "<rootDir>/lib/$1",
        "@lib/(.+)": "<rootDir>/lib/$1",
    },
    testEnvironment: 'jsdom',
    testRegex: '/test/.*\\.test?\\.ts$',
    moduleFileExtensions: ['ts', 'js']
  };