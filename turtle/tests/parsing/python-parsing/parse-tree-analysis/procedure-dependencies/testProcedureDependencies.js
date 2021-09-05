import { testIsDependingOnColorMode } from './testIsDependingOnColorMode.js';
import { testIsDependingOnHeadingMode } from './testIsDependingOnHeadingMode.js';
import { testIsDependingOnPyCircle } from './testIsDependingOnPyCircle.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testProcedureDependencies(logger) {
	wrapAndCall([
		testIsDependingOnColorMode,
		testIsDependingOnHeadingMode,
		testIsDependingOnPyCircle
	], logger);
};