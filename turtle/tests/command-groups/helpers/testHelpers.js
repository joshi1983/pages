import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testSolveQuartic } from './testSolveQuartic.js';
import { testSolveCubic } from './testSolveCubic.js';

export function testHelpers(logger) {
	testSolveQuartic(prefixWrapper('testSolveQuartic', logger));
	testSolveCubic(prefixWrapper('testSolveCubic', logger));
};