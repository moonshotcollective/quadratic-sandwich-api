import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        verbose: true,
        preset: 'ts-jest',
        testEnvironment: 'node',
        testTimeout: 10000,
    };
};
