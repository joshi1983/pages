import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { testIsDependingOnColorMode } from './testIsDependingOnColorMode.js';
import { testIsDependingOnHeadingMode } from './testIsDependingOnHeadingMode.js';
import { testIsDependingOnPyCircle } from './testIsDependingOnPyCircle.js';

export function testProcedureDependencies(logger) {
	testIsDependingOnColorMode(prefixWrapper('testIsDependingOnColorMode', logger));
	testIsDependingOnHeadingMode(prefixWrapper('testIsDependingOnHeadingMode', logger));
	testIsDependingOnPyCircle(prefixWrapper('testIsDependingOnPyCircle', logger));
};