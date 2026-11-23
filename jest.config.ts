import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',

    extensionsToTreatAsEsm: ['.ts'],

    testMatch: ['<rootDir>/src/**/*.spec.ts'],

    testPathIgnorePatterns: [
        '<rootDir>/src/app.controller.spec.ts',
        '/node_modules/',
    ],

    transform: {
        '^.+\\.ts$': [
        'ts-jest',
        {
            useESM: true,
            tsconfig: 'tsconfig.spec.json',
        },
        ],
    },

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    clearMocks: true,

    coverageDirectory: 'coverage',

    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.spec.ts',
        '!src/**/*.module.ts',
        '!src/**/*.dto.ts',
        '!src/**/*.entity.ts',
        '!src/**/*.enum.ts',
        '!src/**/*.type.ts',
    ],
    };

export default config;