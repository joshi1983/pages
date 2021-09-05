import { testFunctionRename } from './testFunctionRename.js';
import { testGetWebLogoSafeFunctionNameFrom } from './testGetWebLogoSafeFunctionNameFrom.js';
import { testRefactor } from './testRefactor.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testRefactoring(logger) {
	wrapAndCall([
		testFunctionRename,
		testGetWebLogoSafeFunctionNameFrom,
		testRefactor
	], logger);
};