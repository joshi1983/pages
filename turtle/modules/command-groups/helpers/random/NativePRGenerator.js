import { PRGenerator } from './PRGenerator.js';

export class NativePRGenerator extends PRGenerator {
};

NativePRGenerator.prototype.randomRatio = Math.random;